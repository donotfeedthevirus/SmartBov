import { NextFunction, Request, Response } from "express";
import { prisma } from "../utils/prisma";

export function requireCowOwner() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const cow = await prisma.cow.findUnique({
      where: { id: req.params.id },
      select: { userId: true }
    });
    if (!cow || cow.userId !== req.user!.id) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

export function requireDeviceOwner() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const device = await prisma.device.findUnique({
      where: { id: req.params.id },
      select: { userId: true }
    });
    if (!device || device.userId !== req.user!.id) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

export function requireGroupOwner() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const group = await prisma.group.findUnique({
      where: { id: req.params.id },
      select: { userId: true, isActive: true }
    });
    if (!group || !group.isActive || group.userId !== req.user!.id) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}
