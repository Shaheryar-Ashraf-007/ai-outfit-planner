import express from "express";
import multer  from "multer";
import path    from "path";
import fs      from "fs";
import { generateOutfit, regenerateOutfit } from "../controllers/Outfit.Controller.js";
import { protect } from "../middleware/middleware.js";

const router = express.Router();

/* ─────────────────────────────────────────────
   Multer — file upload config
   Stores in /uploads/outfits/ temporarily
   Gemini reads it then we delete it
───────────────────────────────────────────── */
const uploadDir = "uploads/outfits";

// Create upload folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `outfit-${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG and WEBP images are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

/* ─────────────────────────────────────────────
   Routes
───────────────────────────────────────────── */

// POST /api/outfit/generate
// photo is optional — use upload.single("photo")
// protect middleware ensures user is logged in
router.post(
  "/generate",
  protect,
  upload.single("photo"),
  generateOutfit
);

// POST /api/outfit/regenerate (no photo needed)
router.post(
  "/regenerate",
  protect,
  regenerateOutfit
);

/* ── Multer error handler ── */
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Image is too large. Maximum size is 5MB.",
      });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
});

export default router;