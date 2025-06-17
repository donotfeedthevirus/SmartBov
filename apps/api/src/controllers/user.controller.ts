import { Request, Response } from "express";
import {
  createUserService,
  deleteUserService,
  listUsersService,
  updateUserService,
} from "../services/user.service";

export async function createUser(req: Request, res: Response) {
  const { email, password, role } = req.body;
  const user = await createUserService(email, password, role);
  res.status(201).json(user);
}

export async function listUsers(req: Request, res: Response) {
  const skip = Number(req.query.skip ?? 0);
  const take = Number(req.query.take ?? 20);
  const users = await listUsersService(skip, take);
  res.json(users);
}

export async function updateUser(req: Request, res: Response) {
  const { id } = req.params;
  const user = await updateUserService(id, req.body);
  res.json(user);
}

export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;
  const user = await deleteUserService(id);
  res.json(user);
}
