import * as tf from '@tensorflow/tfjs-node';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

interface TrainingData {
  imagePath: string;
  label: number;
}

interface TrainingConfig {
  epochs: number;
  batchSize: number;
  learningRate: number;
  validationSplit: number;
}

export class ModelTrainer {
  private model: tf.LayersModel | null = null;
  private readonly imageSize = 224; // Standard input size for many CNN models
  private readonly numClasses: number;
  private readonly modelDir: string;

  constructor(numClasses: number) {
    this.numClasses = numClasses;
    // Use absolute path to project directory
    const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
    this.modelDir = path.join(PROJECT_ROOT, 'models');
    console.log('Model directory:', this.modelDir);
    this.ensureModelDirectory();
  }

  private ensureModelDirectory(): void {
    if (!fs.existsSync(this.modelDir)) {
      fs.mkdirSync(this.modelDir, { recursive: true });
    }
  }

  private async loadAndPreprocessImage(imagePath: string): Promise<tf.Tensor> {
    const imageBuffer = await sharp(imagePath)
      .resize(this.imageSize, this.imageSize)
      .toBuffer();

    return tf.node.decodeImage(imageBuffer)
      .expandDims(0)
      .div(255.0);
  }

  private createModel(): tf.LayersModel {
    const model = tf.sequential();

    // Convolutional layers
    model.add(tf.layers.conv2d({
      inputShape: [this.imageSize, this.imageSize, 3],
      filters: 32,
      kernelSize: 3,
      activation: 'relu'
    }));
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));

    model.add(tf.layers.conv2d({
      filters: 64,
      kernelSize: 3,
      activation: 'relu'
    }));
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));

    model.add(tf.layers.conv2d({
      filters: 128,
      kernelSize: 3,
      activation: 'relu'
    }));
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));

    // Flatten and dense layers
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({ units: 512, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.5 }));
    model.add(tf.layers.dense({ units: this.numClasses, activation: 'softmax' }));

    return model;
  }

  private async prepareTrainingData(dataDir: string): Promise<{
    trainData: TrainingData[];
    validationData: TrainingData[];
  }> {
    const allData: TrainingData[] = [];
    const classDirs = fs.readdirSync(dataDir);

    for (let classIndex = 0; classIndex < classDirs.length; classIndex++) {
      const classDir = path.join(dataDir, classDirs[classIndex]);
      const imageFiles = fs.readdirSync(classDir);

      for (const imageFile of imageFiles) {
        if (imageFile.match(/\.(jpg|jpeg|png)$/i)) {
          allData.push({
            imagePath: path.join(classDir, imageFile),
            label: classIndex
          });
        }
      }
    }

    // Shuffle data
    tf.util.shuffle(allData);

    // Split into training and validation sets
    const splitIndex = Math.floor(allData.length * 0.8);
    return {
      trainData: allData.slice(0, splitIndex),
      validationData: allData.slice(splitIndex)
    };
  }

  public async train(
    dataDir: string,
    config: TrainingConfig = {
      epochs: 20,
      batchSize: 32,
      learningRate: 0.001,
      validationSplit: 0.2
    }
  ): Promise<{ history: tf.History; model: tf.LayersModel }> {
    console.log('Preparing training data...');
    const { trainData, validationData } = await this.prepareTrainingData(dataDir);

    console.log('Creating model...');
    this.model = this.createModel();

    // Compile model
    this.model.compile({
      optimizer: tf.train.adam(config.learningRate),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    console.log('Starting training...');
    const xs: tf.Tensor[] = [];
    const ys: tf.Tensor[] = [];

    for (const item of trainData) {
      const image = await this.loadAndPreprocessImage(item.imagePath);
      xs.push(image.squeeze());
      const label = tf.oneHot(item.label, this.numClasses);
      ys.push(label);
    }

    const xTensor = tf.stack(xs);
    const yTensor = tf.stack(ys);

    const history = await this.model.fit(xTensor, yTensor, {
      epochs: config.epochs,
      batchSize: config.batchSize,
      validationSplit: config.validationSplit,
      callbacks: {
        onEpochEnd: (epoch: number, logs?: tf.Logs) => {
          console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss.toFixed(4)}, accuracy = ${logs?.acc.toFixed(4)}`);
        }
      }
    });

    // Clean up tensors
    tf.dispose([xTensor, yTensor]);

    // Save model
    const modelPath = path.join(this.modelDir, 'plant_disease_model');
    await this.model.save(`file://${modelPath}`);
    console.log(`Model saved to: ${modelPath}`);

    return { history, model: this.model };
  }

  public async evaluate(testData: TrainingData[]): Promise<{
    accuracy: number;
    confusionMatrix: number[][];
  }> {
    if (!this.model) {
      throw new Error('Model not trained yet');
    }

    const predictions: number[] = [];
    const actualLabels: number[] = [];

    for (const item of testData) {
      const image = await this.loadAndPreprocessImage(item.imagePath);
      const prediction = await this.model.predict(image) as tf.Tensor;
      const predictedClass = await prediction.argMax(1).data();
      predictions.push(predictedClass[0]);
      actualLabels.push(item.label);
    }

    // Calculate accuracy
    const correct = predictions.filter((pred, i) => pred === actualLabels[i]).length;
    const accuracy = correct / testData.length;

    // Generate confusion matrix
    const confusionMatrix = Array(this.numClasses)
      .fill(0)
      .map(() => Array(this.numClasses).fill(0));

    for (let i = 0; i < predictions.length; i++) {
      confusionMatrix[actualLabels[i]][predictions[i]]++;
    }

    return { accuracy, confusionMatrix };
  }
} 