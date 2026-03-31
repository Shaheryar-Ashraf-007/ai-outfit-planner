import express from "express";
import { generateOutfitImagesSD } from "../controllers/Image.Controller.js";
import { protect } from "../middleware/middleware.js";

const router = express.Router();

// ✅ protect middleware runs first, then controller
router.post("/generate-outfit-images", protect, generateOutfitImagesSD);

export default router;