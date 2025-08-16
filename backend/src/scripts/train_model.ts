import { ModelTrainer } from '../services/model_trainer';
import path from 'path';
import fs from 'fs';

async function trainModel() {
  try {
    // PlantVillage dataset has 38 classes (different plant diseases)
    const numClasses = 38;
    
    // Initialize the model trainer
    const trainer = new ModelTrainer(numClasses);
    
    // Path to your training data directory
    const trainingDataDir = path.join(process.cwd(), 'training_data');
    
    if (!fs.existsSync(trainingDataDir)) {
      console.error('Training data directory not found:', trainingDataDir);
      console.log('Please run "npm run prepare-dataset" first to download and prepare the dataset.');
      process.exit(1);
    }

    console.log('Starting model training...');
    console.log('Training data directory:', trainingDataDir);
    
    // Train the model with custom configuration
    const { history, model } = await trainer.train(trainingDataDir, {
      epochs: 20,
      batchSize: 32,
      learningRate: 0.001,
      validationSplit: 0.2
    });

    console.log('Training completed successfully!');
    console.log('Training history:', history);
    
    // Optional: Evaluate the model if you have test data
    // const testData = [...]; // Your test data
    // const evaluation = await trainer.evaluate(testData);
    // console.log('Model evaluation:', evaluation);

  } catch (error) {
    console.error('Error training model:', error);
    process.exit(1);
  }
}

// Run the training
trainModel(); 