import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import admin from "firebase-admin";
import db from "../config/db.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyCW3QFh66VVT6eJv7cZhkGQCrzjutmHUKU");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/* ─────────────────────────────────────────────
   Helper — image to Gemini part
───────────────────────────────────────────── */
const fileToGenerativePart = (filePath, mimeType) => ({
  inlineData: {
    data: fs.readFileSync(filePath).toString("base64"),
    mimeType,
  },
});

/* ─────────────────────────────────────────────
   Helper — build prompt
───────────────────────────────────────────── */
const buildPrompt = ({ event, style, gender, season, height, skinTone, bodyType, hasPhoto }) => `
You are an expert Pakistani and South Asian fashion stylist and outfit recommendation AI.

A user has provided the following information:
- Event / Occasion: ${event}
- Preferred Style: ${style}
- Gender: ${gender}
- Season: ${season}
- Height: ${height} cm
- Skin Tone: ${skinTone || "Not specified"}
- Body Type: ${bodyType || "Not specified"}
${hasPhoto ? "- A photo of the user has been provided. Analyze their features, skin tone, and overall look from the image." : "- No photo provided. Base recommendations purely on the details above."}

Based on all this information, generate 4 complete outfit recommendations.

For EACH outfit, provide:
1. A creative outfit title
2. A short subtitle (vibe/aesthetic in 3-4 words)
3. A match percentage (0-100) based on how well it suits all the user's details
4. 2-3 relevant tags (e.g. "Top Pick", "Trending", "Classic", "New Season", "Timeless", "Bold Choice")
5. A color palette — exactly 4 hex color codes that work beautifully together for this outfit
6. A color palette description (e.g. "Deep Crimson · Antique Gold · Ivory")
7. The outfit pieces (exactly 4 items) — each with:
   - piece name (e.g. "Lehenga Skirt", "Kurti Top", "Sherwani")
   - specific detail describing fabric, embroidery, cut, or style
8. Fabric details (e.g. "Silk · Organza")
9. The occasion it's best for (match the user's event)
10. A personalized stylist note (2-3 sentences) that specifically mentions the user's body type${skinTone ? ", skin tone," : ""} and how this outfit flatters them
11. 3 specific styling tips personalized to the user's height, skin tone, and event

IMPORTANT RULES:
- All outfits must be appropriate for the "${event}" occasion
- All outfits must be in "${style}" style aesthetic
- Consider Pakistani/South Asian fashion context
- Colors must complement the user's skin tone (${skinTone || "general"})
- Cuts and silhouettes must flatter the user's body type (${bodyType || "general"})
- Consider the ${season} season for fabric weight and layering
- Sort outfits by match percentage (highest first)

Respond with ONLY a valid JSON object — no markdown, no explanation, just JSON:

{
  "outfits": [
    {
      "id": 1,
      "title": "string",
      "subtitle": "string",
      "match": number,
      "tags": ["string", "string"],
      "palette": ["#hex1", "#hex2", "#hex3", "#hex4"],
      "accentLight": "#hex",
      "colors": "string",
      "fabric": "string",
      "occasion": "string",
      "pieces": [
        { "name": "string", "detail": "string" },
        { "name": "string", "detail": "string" },
        { "name": "string", "detail": "string" },
        { "name": "string", "detail": "string" }
      ],
      "stylistNote": "string"
    }
  ],
  "stylingTips": [
    { "icon": "💡", "tip": "string" },
    { "icon": "👟", "tip": "string" },
    { "icon": "💎", "tip": "string" }
  ],
  "summary": {
    "event": "string",
    "style": "string",
    "gender": "string",
    "season": "string",
    "height": number,
    "skinTone": "string",
    "bodyType": "string"
  }
}
`.trim();

/* ─────────────────────────────────────────────
   Helper — ✅ Auto-save to Firestore
───────────────────────────────────────────── */
const saveToFirestore = async (userId, parsed, userProfile) => {
  try {
    // ✅ Save each outfit as a separate document in "outfits" collection
    const savePromises = parsed.outfits.map((outfit) =>
      db.collection("outfits").add({
        userId,
        outfitName: outfit.title,
        title:      outfit.title,
        subtitle:   outfit.subtitle,
        match:      outfit.match,
        tags:       outfit.tags       || [],
        palette:    outfit.palette    || [],
        colors:     outfit.colors     || "",
        fabric:     outfit.fabric     || "",
        occasion:   outfit.occasion   || "",
        pieces:     outfit.pieces     || [],
        stylistNote: outfit.stylistNote || "",
        image:      null,
        favorite:   false,
        userProfile,
        createdAt:  admin.firestore.FieldValue.serverTimestamp(),
      })
    );

    await Promise.all(savePromises);
    console.log(`✅ ${parsed.outfits.length} outfits auto-saved to Firestore for user: ${userId}`);

  } catch (dbError) {
    // ✅ Don't crash the request if save fails — just log it
    console.error("❌ Firestore auto-save error:", dbError.message);
  }
};

/* ─────────────────────────────────────────────
   GENERATE OUTFIT
   POST /api/outfit/generate
───────────────────────────────────────────── */
export const generateOutfit = async (req, res) => {
  try {
    const { event, style, gender, season, height, skinTone, bodyType } = req.body;

    // ── Validate required fields
    const missing = [];
    if (!event)  missing.push("event");
    if (!style)  missing.push("style");
    if (!gender) missing.push("gender");
    if (!season) missing.push("season");
    if (!height) missing.push("height");

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(", ")}`,
      });
    }

    const hasPhoto = !!req.file;
    const prompt   = buildPrompt({ event, style, gender, season, height: Number(height), skinTone, bodyType, hasPhoto });

    let result;

    if (hasPhoto) {
      const imagePart = fileToGenerativePart(req.file.path, req.file.mimetype);
      const response  = await model.generateContent([prompt, imagePart]);
      result          = response.response.text();
      fs.unlink(req.file.path, (err) => { if (err) console.error("Failed to delete file:", err); });
    } else {
      const response = await model.generateContent(prompt);
      result         = response.response.text();
    }

    // ── Parse Gemini response
    const cleaned = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse Gemini response:", cleaned);
      return res.status(500).json({ success: false, message: "AI returned an invalid response. Please try again." });
    }

    const userProfile = {
      event,
      style,
      gender,
      season,
      height:   Number(height),
      skinTone: skinTone || null,
      bodyType: bodyType || null,
      hasPhoto,
    };

    // ✅ Auto-save to Firestore (non-blocking — won't crash if it fails)
    const userId = req.user?.userId || req.user?.uid || null;
    if (userId) {
      await saveToFirestore(userId, parsed, userProfile);
    } else {
      console.warn("⚠️ No userId found in token — outfits not saved");
    }

    return res.status(200).json({
      success: true,
      data: {
        outfits:     parsed.outfits     || [],
        stylingTips: parsed.stylingTips || [],
        summary:     parsed.summary     || {},
        userProfile,
      },
    });

  } catch (error) {
    console.error("generateOutfit error:", error);

    if (error?.status === 429) {
      return res.status(429).json({ success: false, message: "AI quota exceeded. Please try again in a moment." });
    }
    if (error?.status === 400) {
      return res.status(400).json({ success: false, message: "The uploaded image could not be processed." });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to generate outfit recommendations. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/* ─────────────────────────────────────────────
   REGENERATE OUTFIT
   POST /api/outfit/regenerate
───────────────────────────────────────────── */
export const regenerateOutfit = async (req, res) => {
  try {
    const {
      event, style, gender, season, height,
      skinTone, bodyType,
      excludeTitles  = [],
      moodAdjustment = "",
    } = req.body;

    const basePrompt = buildPrompt({
      event, style, gender, season,
      height: Number(height),
      skinTone, bodyType,
      hasPhoto: false,
    });

    const extraInstructions = `
${excludeTitles.length > 0 ? `IMPORTANT: Do NOT suggest any of these previously shown outfits: ${excludeTitles.join(", ")}` : ""}
${moodAdjustment ? `User wants: ${moodAdjustment}` : ""}
Generate 4 completely different outfit options from before.
    `.trim();

    const response = await model.generateContent(`${basePrompt}\n\n${extraInstructions}`);
    const result   = response.response.text();
    const cleaned  = result.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(500).json({ success: false, message: "AI returned an invalid response. Please try again." });
    }

    const userProfile = {
      event, style, gender, season,
      height:   Number(height),
      skinTone: skinTone || null,
      bodyType: bodyType || null,
      hasPhoto: false,
    };

    // ✅ Auto-save regenerated outfits too
    const userId = req.user?.userId || req.user?.uid || null;
    if (userId) {
      await saveToFirestore(userId, parsed, userProfile);
    }

    return res.status(200).json({
      success: true,
      data: {
        outfits:     parsed.outfits     || [],
        stylingTips: parsed.stylingTips || [],
        summary:     parsed.summary     || {},
        userProfile,
      },
    });

  } catch (error) {
    console.error("regenerateOutfit error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to regenerate outfit recommendations.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};