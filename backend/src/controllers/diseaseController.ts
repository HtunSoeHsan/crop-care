import { Request, Response } from 'express';
import Disease from '../models/Disease';

export const getDiseases = async (req: Request, res: Response) => {
  try {
    const diseases = await Disease.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(diseases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch diseases' });
  }
};

export const createDisease = async (req: Request, res: Response) => {
  try {
    const disease = new Disease(req.body);
    await disease.save();
    res.status(201).json(disease);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create disease' });
  }
};

export const updateDisease = async (req: Request, res: Response) => {
  try {
    const disease = await Disease.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!disease) {
      return res.status(404).json({ error: 'Disease not found' });
    }
    res.json(disease);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update disease' });
  }
};

export const deleteDisease = async (req: Request, res: Response) => {
  try {
    const disease = await Disease.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!disease) {
      return res.status(404).json({ error: 'Disease not found' });
    }
    res.json({ message: 'Disease deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete disease' });
  }
};