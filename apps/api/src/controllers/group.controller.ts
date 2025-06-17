import { Request, Response } from "express";
import {
  createGroup,
  deleteGroup,
  listGroups,
  renameGroup
} from "../services/group.service";

export async function create(req: Request, res: Response) {
  const group = await createGroup(req.user!.id, req.body.name);
  res.status(201).json(group);
}

export async function list(req: Request, res: Response) {
  const groups = await listGroups(req.user!.id);
  res.json(groups);
}

export async function rename(req: Request, res: Response) {
  const group = await renameGroup(req.params.id, req.body.name);
  res.json(group);
}

export async function remove(req: Request, res: Response) {
  try {
    const g = await deleteGroup(req.params.id);
    res.json(g);
  } catch (err: any) {
    if (err.message.includes("active cows"))
      return res.status(409).json({ error: "Group has active cows" });
    throw err;
  }
}
