import { Request, Response } from 'express';
import HealthyFood from '../models/HealthyFood';

export const getHealthyFoods = async (req: Request, res: Response) => {
  try {
    const foods = await HealthyFood.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch healthy foods' });
  }
};

export const createHealthyFood = async (req: Request, res: Response) => {
  try {
    const food = await HealthyFood.create(req.body);
    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create healthy food' });
  }
};

export const updateHealthyFood = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const food = await HealthyFood.findByIdAndUpdate(id, req.body, { new: true });
    if (!food) {
      return res.status(404).json({ error: 'Healthy food not found' });
    }
    res.json(food);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update healthy food' });
  }
};

export const deleteHealthyFood = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const food = await HealthyFood.findByIdAndDelete(id);
    if (!food) {
      return res.status(404).json({ error: 'Healthy food not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete healthy food' });
  }
};
