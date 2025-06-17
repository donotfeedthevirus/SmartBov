import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { requireRole } from "../middlewares/role";
import { requireGroupOwner } from "../middlewares/ownership";
import { validate } from "../utils/validate";
import { z } from "zod";
import * as GroupCtrl from "../controllers/group.controller";

const r = Router();
r.use(authenticate, requireRole("USER")); 

const nameSchema = z.object({ name: z.string().min(1) });

r.post("/", validate(nameSchema), GroupCtrl.create);
r.get("/", GroupCtrl.list);
r.patch("/:id", requireGroupOwner(), validate(nameSchema), GroupCtrl.rename);
r.delete("/:id", requireGroupOwner(), GroupCtrl.remove);

export { r as groupRouter };
