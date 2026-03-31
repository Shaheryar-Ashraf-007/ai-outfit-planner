import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const saveGeneratedImage = async (filePath) => {
  try {
    const uploadDir = path.join("uploads", "outfits");

    // create folder (safe)
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${uuidv4()}.png`;
    const destination = path.join(uploadDir, fileName);

    // async copy (better)
    await fs.promises.copyFile(filePath, destination);

    return `${process.env.BASE_URL || "http://localhost:3000"}/uploads/outfits/${fileName}`;

  } catch (error) {
    console.error("Storage Error:", error);
    return null;
  }
};
