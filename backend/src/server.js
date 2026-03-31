import dotenv from "dotenv";
dotenv.config(); // ✅ MUST be first before any other imports

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import outfitRoutes from "./routes/outfit.route.js";
import saveRoutes from "./routes/save.route.js";
import imageRoutes from "./routes/image.route.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────

// ✅ CORS — allowedHeaders required for Authorization to pass through
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────

app.use("/api/auth", authRoutes);
app.use("/api/outfit", outfitRoutes);
app.use("/api/data", saveRoutes);
app.use("/api/image", imageRoutes);

// ✅ Serve generated images as static files
app.use("/uploads", express.static("uploads"));

// ─────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────

app.get("/", (req, res) => {
  res.send("🚀 AI Outfit Planner API Running...");
});

// ─────────────────────────────────────────────
// Global Error Handler
// ─────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong",
    error: err.message,
  });
});

// ─────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});