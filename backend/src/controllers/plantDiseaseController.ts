import { Request, Response } from 'express';
import PlantDisease from '../models/PlantDisease';

export const getPlantDiseases = async (req: Request, res: Response) => {
  try {
    const diseases = await PlantDisease.find().sort({ classIndex: 1 });
    res.json(diseases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plant diseases' });
  }
};

export const createPlantDisease = async (req: Request, res: Response) => {
  try {
    const disease = new PlantDisease(req.body);
    await disease.save();
    res.status(201).json(disease);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create plant disease' });
  }
};

export const updatePlantDisease = async (req: Request, res: Response) => {
  try {
    const disease = await PlantDisease.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!disease) {
      return res.status(404).json({ error: 'Plant disease not found' });
    }
    res.json(disease);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update plant disease' });
  }
};

export const deletePlantDisease = async (req: Request, res: Response) => {
  try {
    const disease = await PlantDisease.findByIdAndDelete(req.params.id);
    if (!disease) {
      return res.status(404).json({ error: 'Plant disease not found' });
    }
    res.json({ message: 'Plant disease deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete plant disease' });
  }
};