import { Request, Response } from 'express';

export const getHealthyFoods = (req: Request, res: Response) => {
  // TODO: Fetch healthy foods from DB
  res.json([]);
};

export const createHealthyFood = (req: Request, res: Response) => {
  // TODO: Create healthy food in DB
  res.status(201).json({});
};

export const updateHealthyFood = (req: Request, res: Response) => {
  // TODO: Update healthy food in DB
  res.json({});
};

export const deleteHealthyFood = (req: Request, res: Response) => {
  // TODO: Delete healthy food from DB
  res.status(204).send();
};
