import { Router } from "express";
import { enumerate } from "../controllers/enumerate.controller";

const router = Router();

router.post("/", enumerate);

export default router;

