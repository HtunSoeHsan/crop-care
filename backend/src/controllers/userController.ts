import { Request, Response } from 'express';

export const getUsers = (req: Request, res: Response) => {
  // TODO: Fetch users from DB
  res.json([]);
};

export const updateUser = (req: Request, res: Response) => {
  // TODO: Update user in DB
  res.json({});
};

export const deleteUser = (req: Request, res: Response) => {
  // TODO: Delete user from DB
  res.status(204).send();
};
