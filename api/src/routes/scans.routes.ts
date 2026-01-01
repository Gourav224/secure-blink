import { Router } from "express";
import { listScans, getScan } from "../controllers/scans.controller";

const router = Router();

router.get("/", listScans);
router.get("/:filename", getScan);

export default router;
