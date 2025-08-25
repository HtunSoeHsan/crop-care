import { Request, Response } from 'express';
import * as tf from '@tensorflow/tfjs-node';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import Disease from '../models/Disease';
import { ModelInspector } from '../utils/model-inspector';
import { get } from 'http';
import { PlantDisease } from '../types';
import ScanHistory from '../models/ScanHistory';

interface DetectionResult {
  classIndex: number;
  confidence: number;
  className: string;
}

interface EnhancedDetectionResult {
  primaryResult: DetectionResult;
  secondaryResults: DetectionResult[];
  confidence: number;
  reliability: 'HIGH' | 'MEDIUM' | 'LOW';
  validationScore: number;
  recommendations: string[];
}

// Load multiple models for ensemble prediction
let models: tf.LayersModel[] = [];
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const MODEL_DIR = path.join(PROJECT_ROOT, 'models');

// Image preprocessing configurations - adjusted to match your model's requirements
const IMAGE_CONFIGS = [
  { size: 224, normalize: 255.0 } // Only use 224x224 since that's what your model expects
];

// Load multiple models for ensemble prediction
const loadModels = async () => {
  if (models.length === 0) {
    try {
      const modelPaths = [
        path.join(MODEL_DIR, 'plant_disease_model', 'model.json'),
        // Add more model paths here if you have multiple trained models
      ];

      for (const modelPath of modelPaths) {
        if (fs.existsSync(modelPath)) {
          const model = await tf.loadLayersModel(`file://${modelPath}`);
          models.push(model);
          console.log(`Model loaded successfully from: ${modelPath}`);
          
          // Inspect the model to understand its structure
          try {
            const modelInfo = await ModelInspector.inspectModel(modelPath);
            console.log(`Model has ${modelInfo.numClasses} output classes`);
          } catch (inspectionError) {
            console.warn('Could not inspect model:', inspectionError);
          }
        }
      }

      if (models.length === 0) {
        throw new Error('No models found. Please train at least one model first.');
      }
    } catch (error) {
      console.error('Error loading models:', error);
      throw new Error('Failed to load disease detection models.');
    }
  }
  return models;
};

// Validate if image contains plant content
const validatePlantImage = async (imagePath: string): Promise<boolean> => {
  try {
    const imageBuffer = await sharp(imagePath)
      .resize(224, 224)
      .removeAlpha()
      .jpeg({ quality: 90 })
      .toBuffer();

    // Simple heuristic: check for green color dominance (plants typically have green)
    const { dominant } = await sharp(imageBuffer).stats();
    const greenChannel = dominant.g || 0;
    const redChannel = dominant.r || 0;
    const blueChannel = dominant.b || 0;
    
    // Check if green is dominant or if there's sufficient green content
    const greenRatio = greenChannel / (redChannel + greenChannel + blueChannel + 1);
    const hasGreenContent = greenRatio > 0.25; // At least 25% green content
    
    // Additional check: skin tone detection (common RGB ranges for human skin)
    const isSkinTone = (redChannel > 95 && greenChannel > 40 && blueChannel > 20) &&
                      (redChannel > greenChannel && redChannel > blueChannel) &&
                      (Math.abs(redChannel - greenChannel) > 15);
    
    return hasGreenContent && !isSkinTone;
  } catch (error) {
    console.warn('Plant validation failed, proceeding with detection:', error);
    return true; // If validation fails, proceed with detection
  }
};

// Enhanced image preprocessing with multiple techniques
const preprocessImageMultiple = async (imagePath: string): Promise<tf.Tensor[]> => {
  const tensors: tf.Tensor[] = [];
  
  try {
    // Use the first (and only) config - 224x224
    const config = IMAGE_CONFIGS[0];
    
    console.log(`Processing image: ${imagePath}`);
    
    // Basic preprocessing - ensure RGB format (3 channels)
    const imageBuffer = await sharp(imagePath)
      .resize(config.size, config.size)
      .removeAlpha() // Remove alpha channel to ensure RGB
      .jpeg({ quality: 90 }) // Convert to JPEG to ensure 3 channels
      .toBuffer();

    console.log(`Image processed: ${imageBuffer.length} bytes, size: ${config.size}x${config.size}`);

    let tensor = tf.node.decodeImage(imageBuffer, 3) // Explicitly specify 3 channels
      .expandDims(0)
      .div(config.normalize);

    console.log(`Tensor created with shape: [${tensor.shape.join(', ')}]`);

    // Ensure tensor has correct shape [1, 224, 224, 3]
    if (tensor.shape[3] !== 3) {
      console.warn(`Tensor has ${tensor.shape[3]} channels, expected 3. Reshaping...`);
      // If still not 3 channels, take only the first 3
      tensor = tensor.slice([0, 0, 0, 0], [1, 224, 224, 3]);
      console.log(`Tensor reshaped to: [${tensor.shape.join(', ')}]`);
    }

    tensors.push(tensor);

    // Add augmented versions for more robust prediction
    const augmentedTensors = await createAugmentedImages(tensor);
    tensors.push(...augmentedTensors);

    console.log(`Total tensors created: ${tensors.length}`);

    return tensors;
  } catch (error) {
    console.error('Error in image preprocessing:', error);
    throw new Error(`Failed to preprocess image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Create augmented images for better prediction
const createAugmentedImages = async (tensor: tf.Tensor): Promise<tf.Tensor[]> => {
  const augmentedTensors: tf.Tensor[] = [];

  try {
    // Horizontal flip
    const flipped = tf.image.flipLeftRight(tensor as tf.Tensor4D);
    augmentedTensors.push(flipped);

    // Brightness adjustment - simple manual implementation
    const brightened = tensor.add(0.1).clipByValue(0, 1);
    augmentedTensors.push(brightened);

    // Contrast adjustment - simple manual implementation
    const mean = tensor.mean();
    const contrasted = tensor.sub(mean).mul(1.1).add(mean).clipByValue(0, 1);
    augmentedTensors.push(contrasted);

    // Create a slightly darker version
    const darkened = tensor.mul(0.9).clipByValue(0, 1);
    augmentedTensors.push(darkened);

  } catch (error) {
    console.warn('Some augmentation failed, using original tensor:', error);
    // If augmentation fails, just return the original tensor
    augmentedTensors.push(tensor);
  }

  return augmentedTensors;
};

// Validate tensor shape before model prediction
const validateTensorForModel = (tensor: tf.Tensor, model: tf.LayersModel): boolean => {
  const expectedShape = model.inputs[0].shape;
  const actualShape = tensor.shape;
  
  console.log(`Model expects input shape: [${expectedShape.join(', ')}]`);
  console.log(`Tensor actual shape: [${actualShape.join(', ')}]`);
  
  // Check if shapes are compatible
  if (expectedShape.length !== actualShape.length) {
    console.error(`Shape length mismatch: expected ${expectedShape.length}, got ${actualShape.length}`);
    return false;
  }
  
  for (let i = 0; i < expectedShape.length; i++) {
    if (expectedShape[i] !== null && expectedShape[i] !== actualShape[i]) {
      console.error(`Shape mismatch at dimension ${i}: expected ${expectedShape[i]}, got ${actualShape[i]}`);
      return false;
    }
  }
  
  return true;
};

// Ensemble prediction with multiple models and image variations
const detectedResult = async (tensors: tf.Tensor[]): Promise<PlantDisease[]> => {
  const models = await loadModels();
  const allPredictions: number[][] = [];

  try {
    // Get predictions from all models and all image variations
    for (const model of models) {
      for (const tensor of tensors) {
        // Validate tensor before prediction
        if (!validateTensorForModel(tensor, model)) {
          console.warn('Skipping tensor due to shape mismatch');
          continue;
        }
        
        const prediction = await model.predict(tensor) as tf.Tensor;
        const probabilities = Array.from(await prediction.data());
        allPredictions.push(probabilities);
        prediction.dispose();
      }
    }

    if (allPredictions.length === 0) {
      throw new Error('No valid predictions generated. Check tensor shapes and model compatibility.');
    }

    // Calculate ensemble results
    const numClasses = allPredictions[0].length;
    const averageProbabilities = new Array(numClasses).fill(0);
    
    // Average all predictions
    for (const prediction of allPredictions) {
      for (let i = 0; i < numClasses; i++) {
        averageProbabilities[i] += prediction[i];
      }
    }
    
    for (let i = 0; i < numClasses; i++) {
      averageProbabilities[i] /= allPredictions.length;
    }

    // Get top predictions
    const topPredictions = averageProbabilities
      .map((prob, index) => ({ classIndex: index, confidence: prob }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);

    const top5 = topPredictions.filter(pred => pred.confidence * 100 > 0.1); // Filter out low confidence predictions
    console.log("top5",top5);
    const top5Result: PlantDisease[] = [];
    
    for (const pred of top5) {
      const diseaseInfo = await Disease.findOne({ classIndex: pred.classIndex }) || {
        name: { en: 'Unknown Disease', my: 'Penyakit Tidak Diketahui' },
        description: { en: 'Unable to identify this disease', my: 'Tidak dapat mengenal pasti penyakit ini' },
        symptoms: [{ en: 'Unknown symptoms', my: 'Gejala tidak diketahui' }],
        plantType: { en: 'Unknown', my: 'Tidak Diketahui' },
        treatments: [{
          name: { en: 'Consult Expert', my: 'Rujuk Pakar' },
          description: { en: 'Please consult with a plant disease expert', my: 'Sila rujuk pakar penyakit tumbuhan' },
          steps: [{ en: 'Contact local agricultural extension', my: 'Hubungi pejabat pertanian tempatan' }]
        }],
        recommendations: []
      };
      
      const diseaseData = diseaseInfo && (diseaseInfo as any).toObject 
        ? (diseaseInfo as any).toObject() 
        : diseaseInfo;
      
      top5Result.push({
        classIndex: pred.classIndex,
        ...diseaseData,
        detection: {
          confidence: `${(pred.confidence * 100).toFixed(2)}`,
          imageUrl: '',
          detectedAt: new Date()
        }
      });
    }
    console.log("top5Result",top5Result); 
    return top5Result;
  } catch (error) {
    console.error('Error in ensemble prediction:', error);
    throw error;
  }
};

// Enhanced disease detection endpoint
export const enhancedDetectDisease = async (req: Request, res: Response) => {
  const tensors: tf.Tensor[] = [];
  
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No image file provided'
      });
    }

    // const userId = (req as any).user.userId;
    const imagePath = req.file.path;

    // console.log(`Processing detection request for user: ${userId}`);
    console.log(`Image file: ${imagePath}, size: ${req.file.size} bytes, mimetype: ${req.file.mimetype}`);

    // Validate if image contains plant content
    const isPlantImage = await validatePlantImage(imagePath);
    if (!isPlantImage) {
      return res.status(400).json({
        status: 'error',
        message: 'Please upload an image of a plant leaf or crop. The uploaded image does not appear to contain plant material.',
        code: 'INVALID_IMAGE_CONTENT'
      });
    }

    // Preprocess image with multiple techniques
    const preprocessedTensors = await preprocessImageMultiple(imagePath);
    tensors.push(...preprocessedTensors);

    console.log(`Image preprocessing completed. Created ${tensors.length} tensors`);

    // Perform ensemble prediction
    const results = await detectedResult(preprocessedTensors);
    
    console.log(`Detection completed successfully. Found ${results.length} results`);
    
    res.json({
      status: 'success',
      data: results,
      imageUrl: `/uploads/${path.basename(imagePath)}`
    });

  } catch (error) {
    console.error('Enhanced detection error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Error processing enhanced detection';
    if (error instanceof Error) {
      if (error.message.includes('shape')) {
        errorMessage = 'Image format error: Please ensure the image is a valid JPEG, PNG, or WebP file';
      } else if (error.message.includes('Failed to preprocess')) {
        errorMessage = 'Image processing error: Please try with a different image';
      } else {
        errorMessage = error.message;
      }
    }
    
    res.status(500).json({
      status: 'error',
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
    });
  } finally {
    // Clean up all tensors
    try {
      tensors.forEach(tensor => {
        if (tensor && !tensor.isDisposed) {
          tensor.dispose();
        }
      });
      console.log('Tensors cleaned up successfully');
    } catch (cleanupError) {
      console.warn('Error during tensor cleanup:', cleanupError);
    }
  }
};
