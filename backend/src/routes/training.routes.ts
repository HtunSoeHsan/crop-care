import { Router } from 'express';
import { TrainingController } from '../controllers/training.controller';

const router = Router();

router.get('/datasets', TrainingController.getDatasets);
router.post('/start', TrainingController.startTraining);
router.post('/stop/:jobId', TrainingController.stopTraining);
router.get('/jobs', TrainingController.getTrainingJobs);
router.get('/jobs/:jobId', TrainingController.getTrainingJob);

export default router;