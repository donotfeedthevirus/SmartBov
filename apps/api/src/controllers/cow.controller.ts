import { Request, Response } from "express";
import { createCow, listCows, updateCow, softDeleteCow } from "../services/cow.service";

export async function create(req: Request, res: Response) {
  const { alias, tagNumber, groupId } = req.body;
  const cow = await createCow(req.user!.id, alias, tagNumber, groupId);
  res.status(201).json(cow);
}

export async function list(req: Request, res: Response) {
  const groupId = typeof req.query.groupId === "string" ? req.query.groupId : undefined;
  const cows = await listCows(req.user!.id, groupId);
  res.json(cows);
}

export async function update(req: Request, res: Response) {
  const cow = await updateCow(req.params.id, req.body);
  res.json(cow);
}

export async function remove(req: Request, res: Response) {
  const cow = await softDeleteCow(req.params.id);
  res.json(cow);
}
