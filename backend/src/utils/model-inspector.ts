import * as tf from '@tensorflow/tfjs-node';
import path from 'path';
import fs from 'fs';

export class ModelInspector {
  
  static async inspectModel(modelPath: string) {
    try {
      console.log('🔍 Inspecting model at:', modelPath);
      
      if (!fs.existsSync(modelPath)) {
        throw new Error(`Model file not found: ${modelPath}`);
      }
      
      const model = await tf.loadLayersModel(`file://${modelPath}`);
      
      console.log('📊 Model Summary:');
      console.log('- Input shape:', model.inputs[0].shape);
      console.log('- Output shape:', model.outputs[0].shape);
      console.log('- Number of layers:', model.layers.length);
      
      // Get the output layer (final layer)
      const outputLayer = model.layers[model.layers.length - 1];
      console.log('- Output layer name:', outputLayer.name);
      console.log('- Output layer type:', outputLayer.getClassName());
      
      // If it's a Dense layer, get the units (number of classes)
      if (outputLayer.getClassName() === 'Dense') {
        const config = outputLayer.getConfig();
        console.log('- Number of output classes:', config.units);
      }
      
      // Test with a dummy input to see the actual output shape
      const dummyInput = tf.zeros([1, 224, 224, 3]);
      const prediction = model.predict(dummyInput) as tf.Tensor;
      const outputShape = prediction.shape;
      console.log('- Actual output shape:', outputShape);
      
      // Get sample predictions to see the range
      const samplePredictions = await prediction.data();
      console.log('- Sample predictions (first 10):', Array.from(samplePredictions).slice(0, 10));
      console.log('- Prediction sum:', Array.from(samplePredictions).reduce((sum, val) => sum + val, 0));
      
      prediction.dispose();
      dummyInput.dispose();
      
      return {
        inputShape: model.inputs[0].shape,
        outputShape: outputShape,
        numClasses: outputShape[1],
        modelSummary: {
          layers: model.layers.length,
          outputLayerName: outputLayer.name,
          outputLayerType: outputLayer.getClassName()
        }
      };
      
    } catch (error) {
      console.error('❌ Error inspecting model:', error);
      throw error;
    }
  }
  
  static async checkModelPredictions(modelPath: string, sampleImagePath?: string) {
    try {
      const model = await tf.loadLayersModel(`file://${modelPath}`);
      
      // Create a few test inputs
      const testInputs = [
        tf.zeros([1, 224, 224, 3]), // Black image
        tf.ones([1, 224, 224, 3]), // White image
        tf.randomNormal([1, 224, 224, 3]), // Random noise
      ];
      
      console.log('🧪 Testing model predictions:');
      
      for (let i = 0; i < testInputs.length; i++) {
        const prediction = model.predict(testInputs[i]) as tf.Tensor;
        const probabilities = await prediction.data();
        const maxIndex = Array.from(probabilities).indexOf(Math.max(...probabilities));
        
        console.log(`Test ${i + 1}:`);
        console.log(`- Max probability: ${Math.max(...probabilities).toFixed(4)}`);
        console.log(`- Max index: ${maxIndex}`);
        console.log(`- Top 3 indices:`, Array.from(probabilities)
          .map((prob, idx) => ({ idx, prob }))
          .sort((a, b) => b.prob - a.prob)
          .slice(0, 3)
          .map(item => `${item.idx}:${item.prob.toFixed(4)}`));
        
        prediction.dispose();
        testInputs[i].dispose();
      }
      
    } catch (error) {
      console.error('❌ Error checking model predictions:', error);
      throw error;
    }
  }
}
