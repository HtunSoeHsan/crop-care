import express from 'express';
import { ModelInspector } from '../utils/model-inspector';
import { getDiseaseByClassIndex } from '../config/disease-mapping';
import path from 'path';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

// Debug route to inspect the model
router.get('/inspect-model', authenticateToken, async (req, res) => {
  try {
    const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
    const MODEL_PATH = path.join(PROJECT_ROOT, 'models', 'plant_disease_model', 'model.json');
    
    console.log('Attempting to inspect model at:', MODEL_PATH);
    
    const modelInfo = await ModelInspector.inspectModel(MODEL_PATH);
    
    // Check which classes are actually mapped
    const mappedClasses = [];
    const numClasses = modelInfo.numClasses || 38; // Default to 38 if undefined
    for (let i = 0; i < numClasses; i++) {
      const diseaseInfo = getDiseaseByClassIndex(i);
      mappedClasses.push({
        classIndex: i,
        diseaseName: diseaseInfo?.name || { en: 'Unknown', my: 'Tidak Diketahui' },
        plantType: diseaseInfo?.plantType || { en: 'Unknown', my: 'Tidak Diketahui' }
      });
    }
    
    res.json({
      status: 'success',
      data: {
        modelInfo,
        mappedClasses: mappedClasses.slice(0, 20), // Show first 20 classes
        totalMappedClasses: mappedClasses.length
      }
    });
    
  } catch (error) {
    console.error('Debug model inspection error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to inspect model',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Debug route to test model predictions
router.get('/test-predictions', authenticateToken, async (req, res) => {
  try {
    const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
    const MODEL_PATH = path.join(PROJECT_ROOT, 'models', 'plant_disease_model', 'model.json');
    
    await ModelInspector.checkModelPredictions(MODEL_PATH);
    
    res.json({
      status: 'success',
      message: 'Model predictions tested - check server logs for results'
    });
    
  } catch (error) {
    console.error('Debug prediction test error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to test predictions',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Debug route to show all disease mappings
router.get('/disease-mappings', authenticateToken, (req, res) => {
  try {
    const mappings = [];
    
    // Check mappings for classes 0-50 (should cover most models)
    for (let i = 0; i < 50; i++) {
      const diseaseInfo = getDiseaseByClassIndex(i);
      if (diseaseInfo) {
        mappings.push({
          classIndex: i,
          name: diseaseInfo.name,
          plantType: diseaseInfo.plantType,
          description: diseaseInfo.description
        });
      }
    }
    
    // Group by plant type
    const byPlantType = mappings.reduce((acc, mapping) => {
      const plantTypeKey = mapping.plantType.en; // Extract English plant type name
      if (!acc[plantTypeKey]) {
        acc[plantTypeKey] = [];
      }
      acc[plantTypeKey].push(mapping);
      return acc;
    }, {} as { [key: string]: any[] });
    
    res.json({
      status: 'success',
      data: {
        totalMappings: mappings.length,
        mappings: mappings,
        byPlantType: byPlantType
      }
    });
    
  } catch (error) {
    console.error('Debug disease mappings error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get disease mappings',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
