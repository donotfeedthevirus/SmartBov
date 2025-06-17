import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { requireRole } from "../middlewares/role";
import { requireCowOwner } from "../middlewares/ownership";
import { validate } from "../utils/validate";
import { z } from "zod";
import * as CowCtrl from "../controllers/cow.controller";

const r = Router();
r.use(authenticate, requireRole("USER")); 

const createSchema = z.object({
  alias: z.string(),
  tagNumber: z.string(),
  groupId: z.string().uuid().optional(),
});
const updateSchema = z.object({
  alias: z.string().optional(),
  groupId: z.string().uuid().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "SOLD"]).optional(),
});

r.post("/", validate(createSchema), CowCtrl.create);
r.get("/", CowCtrl.list);
r.patch("/:id", requireCowOwner(), validate(updateSchema), CowCtrl.update);
r.delete("/:id", requireCowOwner(), CowCtrl.remove);

export { r as cowRouter };
