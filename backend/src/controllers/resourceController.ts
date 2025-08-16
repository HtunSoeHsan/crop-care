import { Request, Response } from 'express';

export const getResources = (req: Request, res: Response) => {
  // TODO: Fetch resources from DB
  res.json([]);
};

export const createResource = (req: Request, res: Response) => {
  // TODO: Create resource in DB
  res.status(201).json({});
};

export const updateResource = (req: Request, res: Response) => {
  // TODO: Update resource in DB
  res.json({});
};

export const deleteResource = (req: Request, res: Response) => {
  // TODO: Delete resource from DB
  res.status(204).send();
};
