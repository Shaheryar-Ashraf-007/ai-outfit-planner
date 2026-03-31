import express from "express";
import { protect } from "../middleware/middleware.js";
import {
  getMyOutfits,
  getFavoriteOutfits,
  saveOutfit,
  deleteOutfit,
  toggleFavorite,
  updateOutfit,
} from "../controllers/Save.Controller.js";

const router = express.Router();

router.post("/", protect, saveOutfit);                        // Save outfit
router.get("/my", protect, getMyOutfits);                     // Get all outfits
router.get("/favorites", protect, getFavoriteOutfits);        // Get favorites
router.post("/favorite/:outfitId", protect, toggleFavorite);  // ✅ Toggle favorite
router.put("/:outfitId", protect, updateOutfit);              // Update outfit
router.delete("/:outfitId", protect, deleteOutfit);           // Delete outfit

export default router;