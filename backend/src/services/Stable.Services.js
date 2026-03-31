import fs from "fs";
import Replicate from "replicate";

// ✅ Lazy init — runs AFTER dotenv.config() in app.js
const getReplicate = () => {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) throw new Error("REPLICATE_API_TOKEN is not set in .env");
  return new Replicate({ auth: token });
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ✅ Auto-retry on 429 rate limit
const runWithRetry = async (replicate, model, input, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await replicate.run(model, { input });
    } catch (error) {
      const is429 = error.message?.includes("429");
      const is402 = error.message?.includes("402");

      if (is402) {
        throw new Error("Insufficient Replicate credits. Add credits at https://replicate.com/account/billing");
      }

      const seconds = parseInt(error.message?.match(/resets in ~(\d+)s/)?.[1] || "10");
      const waitMs = (seconds + 1) * 1000;

      if (is429 && attempt < retries) {
        console.warn(`⚠️ Rate limited. Retrying in ${seconds + 1}s... (attempt ${attempt}/${retries})`);
        await sleep(waitMs);
      } else {
        throw error;
      }
    }
  }
};

export const generateStableDiffusionImage = async (prompt, outputPath) => {
  try {
    const replicate = getReplicate();

    console.log("🔑 Replicate token:", process.env.REPLICATE_API_TOKEN?.slice(0, 8) + "...");

    const output = await runWithRetry(replicate, "black-forest-labs/flux-schnell", {
      prompt,
      num_outputs: 1,
      aspect_ratio: "3:4",
      output_format: "png",
      output_quality: 90,
    });

    const imageUrl = Array.isArray(output) ? output[0] : output;

    if (!imageUrl) {
      throw new Error("No image URL returned from Replicate");
    }

    console.log("🖼️ Image URL:", imageUrl);

    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(buffer));

    console.log("✅ Image saved to:", outputPath);

    return outputPath;

  } catch (error) {
    console.error("❌ Replicate Error:", error.message);
    throw error;
  }
};