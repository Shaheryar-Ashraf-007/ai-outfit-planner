import fs from "fs";
import path from "path";
import { generateStableDiffusionImage } from "../services/Stable.Services.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const generateOutfitImagesSD = async (req, res) => {
  try {
    const { outfits, userProfile } = req.body;

    if (!Array.isArray(outfits) || outfits.length === 0) {
      return res.status(400).json({ message: "No outfits provided" });
    }

    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    const MAX_IMAGES = 3;
    const images = [];

    for (let i = 0; i < Math.min(outfits.length, MAX_IMAGES); i++) {
      const outfit = outfits[i];

      const prompt = `
        High fashion studio photograph of ${outfit.title}.
        Style: ${outfit.subtitle}.
        Clothing items: ${outfit.pieces?.map((p) => p.name).join(", ")}.
        Season: ${userProfile?.season}.
        Pakistani model, full body shot, ultra realistic, 4k, clean white background.
      `.trim();

      try {
        const fileName = `outfit_${Date.now()}_${i}.png`;
        const filePath = path.join(uploadDir, fileName);

        console.log(`🎨 Generating image ${i + 1}/${Math.min(outfits.length, MAX_IMAGES)}...`);

        await generateStableDiffusionImage(prompt, filePath);

        images.push(`http://localhost:3000/uploads/${fileName}`);

        console.log(`✅ Image ${i + 1} done`);

        // ✅ Delay between requests to avoid rate limiting
        if (i < Math.min(outfits.length, MAX_IMAGES) - 1) {
          await sleep(2000);
        }

      } catch (err) {
        console.error(`❌ Failed image ${i + 1}:`, err.message);
        images.push(null);
      }
    }

    return res.json({ success: true, data: images });

  } catch (error) {
    console.error("❌ Controller error:", error.message);
    return res.status(500).json({ message: "Failed to generate images" });
  }
};