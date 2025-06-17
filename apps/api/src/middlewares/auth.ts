import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma";

declare module "express-serve-static-core" {
  interface Request {
    user?: { id: string; role: "ADMIN" | "USER" };
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET!) as {
      sub: string; role: "ADMIN" | "USER";
    };
    // optional: load user to ensure still exists
    const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true, role: true }});
    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
