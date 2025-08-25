import { Request, Response } from 'express';
import { TrainingJob } from '../models/TrainingJob';
import { ModelTrainer } from '../services/model_trainer';
import fs from 'fs';
import path from 'path';

export class TrainingController {
  private static activeTrainings = new Map<string, { trainer: ModelTrainer; abortController: AbortController }>();

  static async getDatasets(req: Request, res: Response) {
    try {
      const trainingDataPath = path.join(__dirname, '../../training_data');
      const datasets = fs.readdirSync(trainingDataPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => {
          const classPath = path.join(trainingDataPath, dirent.name);
          const imageCount = fs.readdirSync(classPath).filter(file => 
            file.match(/\.(jpg|jpeg|png)$/i)
          ).length;
          return {
            name: dirent.name,
            path: classPath,
            imageCount
          };
        });

      const datasetStructure = datasets.reduce((acc, dataset, index) => {
        acc[dataset.name] = index;
        return acc;
      }, {} as { [key: string]: number });

      res.json({
        datasets,
        classIndices: datasetStructure,
        totalClasses: datasets.length
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to load datasets' });
    }
  }

  static async startTraining(req: Request, res: Response) {
    try {
      const { datasetName, selectedDatasets, epochs = 20, batchSize = 32, learningRate = 0.001, useTransferLearning = false } = req.body;
      
      const trainingDataPath = path.join(__dirname, '../../training_data');
      const datasets = fs.readdirSync(trainingDataPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory());

      const classIndices = datasets.reduce((acc, dataset, index) => {
        acc[dataset.name] = index;
        return acc;
      }, {} as { [key: string]: number });

      const trainingJob = new TrainingJob({
        datasetPath: trainingDataPath,
        datasetName: datasetName === 'ALL_DATASETS' ? 'All Datasets Combined' 
                   : datasetName === 'CUSTOM_DATASETS' ? `Custom (${selectedDatasets?.length || 0} datasets)`
                   : datasetName,
        classIndices,
        epochs,
        batchSize,
        learningRate
      });

      await trainingJob.save();

      // Start training in background
      TrainingController.runTraining((trainingJob._id as any).toString(), trainingDataPath, {
        epochs,
        batchSize,
        learningRate,
        validationSplit: 0.2,
        useTransferLearning,
        trainAllDatasets: datasetName === 'ALL_DATASETS',
        selectedDatasets: selectedDatasets
      });

      res.json({ jobId: trainingJob._id, message: 'Training started' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to start training' });
    }
  }

  static async stopTraining(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      
      const activeTraining = TrainingController.activeTrainings.get(jobId);
      if (activeTraining) {
        activeTraining.abortController.abort();
        TrainingController.activeTrainings.delete(jobId);
      }

      await TrainingJob.findByIdAndUpdate(jobId, {
        status: 'stopped',
        endTime: new Date()
      });

      res.json({ message: 'Training stopped' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to stop training' });
    }
  }

  static async getTrainingJobs(req: Request, res: Response) {
    try {
      const jobs = await TrainingJob.find().sort({ createdAt: -1 });
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch training jobs' });
    }
  }

  static async getTrainingJob(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const job = await TrainingJob.findById(jobId);
      
      if (!job) {
        return res.status(404).json({ error: 'Training job not found' });
      }

      res.json(job);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch training job' });
    }
  }

  private static async runTraining(jobId: string, dataPath: string, config: any) {
    const abortController = new AbortController();
    
    try {
      const job = await TrainingJob.findById(jobId);
      if (!job) return;

      // Calculate number of classes based on selection
      const numClasses = config.selectedDatasets ? config.selectedDatasets.length : Object.keys(job.classIndices).length;
      const trainer = new ModelTrainer(numClasses);
      TrainingController.activeTrainings.set(jobId, { trainer, abortController });

      await TrainingJob.findByIdAndUpdate(jobId, {
        status: 'running',
        startTime: new Date(),
        logs: ['Training started...']
      });

      // Extract config parameters
      const { epochs, batchSize, learningRate, useTransferLearning } = config;

      // Custom training with progress updates
      const result = await trainer.train(dataPath, {
        epochs,
        batchSize,
        learningRate,
        validationSplit: 0.2,
        useTransferLearning,
        selectedDatasets: config.selectedDatasets,
        onProgress: async (epoch: number, logs: any) => {
          const progress = Math.min(Math.round((epoch / epochs) * 100), 100);
          const logMessage = `Epoch ${epoch}/${epochs}: loss=${logs?.loss?.toFixed(4)}, acc=${logs?.acc?.toFixed(4)}, val_loss=${logs?.val_loss?.toFixed(4)}, val_acc=${logs?.val_acc?.toFixed(4)}`;
          
          await TrainingJob.findByIdAndUpdate(jobId, {
            progress,
            $push: { logs: logMessage }
          });
        }
      });
      
      console.log('Training completed, updating status...');

      const finalAccuracy = result.history.history.acc?.[result.history.history.acc.length - 1] || 0;
      
      await TrainingJob.findByIdAndUpdate(jobId, {
        status: 'completed',
        endTime: new Date(),
        progress: 100,
        accuracy: finalAccuracy,
        modelPath: path.join(__dirname, '../../models/plant_disease_model'),
        $push: { logs: 'Training completed successfully!' }
      });
      
      console.log(`Training job ${jobId} marked as completed with accuracy: ${finalAccuracy}`);

    } catch (error: any) {
      await TrainingJob.findByIdAndUpdate(jobId, {
        status: 'failed',
        endTime: new Date(),
        $push: { logs: `Training failed: ${error?.message || 'Unknown error'}` }
      });
    } finally {
      TrainingController.activeTrainings.delete(jobId);
    }
  }
}