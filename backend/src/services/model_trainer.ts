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
  onProgress?: (epoch: number, logs: any) => Promise<void>;
  useTransferLearning?: boolean;
  selectedDatasets?: string[];
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

  private async loadAndPreprocessImage(imagePath: string, augment: boolean = false): Promise<tf.Tensor> {
    let sharpImage = sharp(imagePath)
      .resize(this.imageSize, this.imageSize, { 
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 90 });
    
    // Data augmentation for training
    if (augment) {
      const shouldFlip = Math.random() > 0.5;
      const brightness = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
      
      if (shouldFlip) sharpImage = sharpImage.flop();
      sharpImage = sharpImage.modulate({ brightness });
    }
    
    const imageBuffer = await sharpImage.toBuffer();
    const tensor = tf.node.decodeImage(imageBuffer, 3)
      .resizeNearestNeighbor([this.imageSize, this.imageSize])
      .expandDims(0)
      .div(255.0);
    return tensor;
  }

  private async createTransferLearningModel(): Promise<tf.LayersModel> {
    try {
      // Try to load MobileNetV2 from TensorFlow.js models
      const baseModel = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v2_1.0_224/model.json');
      
      // Freeze base model layers
      baseModel.layers.forEach(layer => {
        layer.trainable = false;
      });

      const model = tf.sequential();
      model.add(tf.layers.inputLayer({ inputShape: [this.imageSize, this.imageSize, 3] }));
      
      // Add base model layers (excluding top classification layer)
      for (let i = 0; i < baseModel.layers.length - 1; i++) {
        model.add(baseModel.layers[i]);
      }
      
      model.add(tf.layers.globalAveragePooling2d({}));
      model.add(tf.layers.dropout({ rate: 0.2 }));
      model.add(tf.layers.dense({ units: 512, activation: 'relu' }));
      model.add(tf.layers.batchNormalization());
      model.add(tf.layers.dropout({ rate: 0.5 }));
      model.add(tf.layers.dense({ units: this.numClasses, activation: 'softmax' }));

      return model;
    } catch (error) {
      console.warn('Failed to load pre-trained model, using custom CNN instead:', error);
      return this.createModel();
    }
  }

  private createModel(): tf.LayersModel {
    const model = tf.sequential();

    // Lightweight CNN for memory efficiency
    model.add(tf.layers.conv2d({
      inputShape: [this.imageSize, this.imageSize, 3],
      filters: 32,
      kernelSize: 3,
      padding: 'same',
      activation: 'relu'
    }));
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
    model.add(tf.layers.dropout({ rate: 0.25 }));

    model.add(tf.layers.conv2d({ filters: 64, kernelSize: 3, padding: 'same', activation: 'relu' }));
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
    model.add(tf.layers.dropout({ rate: 0.25 }));

    model.add(tf.layers.conv2d({ filters: 128, kernelSize: 3, padding: 'same', activation: 'relu' }));
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
    model.add(tf.layers.dropout({ rate: 0.25 }));

    model.add(tf.layers.globalAveragePooling2d({}));
    model.add(tf.layers.dense({ units: 256, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.5 }));
    model.add(tf.layers.dense({ units: this.numClasses, activation: 'softmax' }));

    return model;
  }

  private async prepareTrainingData(dataDir: string, selectedDatasets?: string[]): Promise<{
    trainData: TrainingData[];
    validationData: TrainingData[];
  }> {
    const allData: TrainingData[] = [];
    const classDirs = fs.readdirSync(dataDir);
    
    // Filter directories based on selection
    const targetDirs = selectedDatasets ? 
      classDirs.filter(dir => selectedDatasets.includes(dir)) : 
      classDirs;

    for (let classIndex = 0; classIndex < targetDirs.length; classIndex++) {
      const classDir = path.join(dataDir, targetDirs[classIndex]);
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
    const { trainData, validationData } = await this.prepareTrainingData(dataDir, config.selectedDatasets);

    console.log('Creating model...');
    this.model = config.useTransferLearning ? 
      await this.createTransferLearningModel() : 
      this.createModel();

    // Compile with better optimizer and learning rate scheduling
    this.model.compile({
      optimizer: tf.train.adam(config.learningRate, 0.9, 0.999, 1e-7),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    console.log('Starting training...');
    const xs: tf.Tensor[] = [];
    const ys: tf.Tensor[] = [];

    // Process in smaller batches to reduce memory usage
    const batchSize = Math.min(config.batchSize, 8);
    const numBatches = Math.ceil(trainData.length / batchSize);
    
    for (let i = 0; i < Math.min(numBatches, 10); i++) {
      const batchStart = i * batchSize;
      const batchEnd = Math.min(batchStart + batchSize, trainData.length);
      const batchData = trainData.slice(batchStart, batchEnd);
      
      for (const item of batchData) {
        const image = await this.loadAndPreprocessImage(item.imagePath, true);
        xs.push(image.squeeze());
        const label = tf.oneHot(item.label, this.numClasses);
        ys.push(label);
      }
    }

    const xTensor = tf.stack(xs);
    const yTensor = tf.stack(ys);

    const history = await this.model.fit(xTensor, yTensor, {
      epochs: config.epochs,
      batchSize: config.batchSize,
      validationSplit: config.validationSplit,
      shuffle: true,
      callbacks: {
        onEpochEnd: async (epoch: number, logs?: tf.Logs) => {
          console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss.toFixed(4)}, accuracy = ${logs?.acc.toFixed(4)}, val_loss = ${logs?.val_loss?.toFixed(4)}, val_accuracy = ${logs?.val_acc?.toFixed(4)}`);
          if (config.onProgress) {
            await config.onProgress(epoch + 1, logs);
          }
        }
      }
    });

    // Clean up tensors
    tf.dispose([xTensor, yTensor]);

    // Save model with versioning
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const versionedPath = path.join(this.modelDir, `plant_disease_model_${timestamp}`);
    const latestPath = path.join(this.modelDir, 'plant_disease_model');
    
    await this.model.save(`file://${versionedPath}`);
    await this.model.save(`file://${latestPath}`);
    console.log(`Model saved to: ${versionedPath} and ${latestPath}`);

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