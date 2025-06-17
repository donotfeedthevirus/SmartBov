import { Request, Response } from "express";
import { createUser, signJwt, verifyCredentials } from "../services/auth.service";

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email & password required" });
  try {
    const user = await createUser(email, password);
    const token = signJwt(user);
    res.status(201).json({ user, token });
  } catch (err: any) {
    if (err.code === "P2002") {                      
      return res.status(409).json({ error: "Email already in use" });
    }
    throw err;                                      
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email & password required" });

  const user = await verifyCredentials(email, password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const token = signJwt(user);
  const { password: _p, ...safe } = user as any;
  res.json({ user: safe, token });
}
