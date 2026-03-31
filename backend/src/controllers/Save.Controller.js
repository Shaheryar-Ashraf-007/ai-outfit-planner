import admin from "firebase-admin";
import db from "../config/db.js";

// =====================
// CREATE / SAVE OUTFIT
// =====================
export const saveOutfit = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "User not authenticated" });

    const { outfitName, outfitItems, favorite = false } = req.body;
    if (!outfitName || !outfitItems) {
      return res.status(400).json({ message: "Outfit name and items required" });
    }

    const newOutfit = {
      userId,
      outfitName,
      outfitItems,
      favorite,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("outfits").add(newOutfit);
    res.status(201).json({ id: docRef.id, ...newOutfit });

  } catch (error) {
    console.error("Error saving outfit:", error);
    res.status(500).json({ message: "Failed to save outfit" });
  }
};

// =====================
// GET ALL USER OUTFITS
// ✅ Removed orderBy to avoid composite index requirement
// =====================
export const getMyOutfits = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "User not authenticated" });

    const snapshot = await db
      .collection("outfits")
      .where("userId", "==", userId)
      .get(); // ✅ No orderBy — sort in JS instead

    const outfits = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // ✅ Convert Firestore Timestamp to ms for JSON
        createdAt: doc.data().createdAt?.toMillis?.() || Date.now(),
      }))
      .sort((a, b) => b.createdAt - a.createdAt); // ✅ Sort newest first in JS

    res.status(200).json(outfits);

  } catch (error) {
    console.error("Error fetching my outfits:", error);
    res.status(500).json({ message: "Failed to fetch outfits", error: error.message });
  }
};

// =====================
// GET FAVORITE OUTFITS
// ✅ Removed orderBy to avoid composite index requirement
// =====================
export const getFavoriteOutfits = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "User not authenticated" });

    const snapshot = await db
      .collection("outfits")
      .where("userId", "==", userId)
      .where("favorite", "==", true)
      .get(); // ✅ No orderBy — sort in JS instead

    const favorites = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toMillis?.() || Date.now(),
      }))
      .sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json(favorites);

  } catch (error) {
    console.error("Error fetching favorite outfits:", error);
    res.status(500).json({ message: "Failed to fetch favorites", error: error.message });
  }
};

// =====================
// TOGGLE FAVORITE
// =====================
export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { outfitId } = req.params;

    if (!userId) return res.status(401).json({ message: "User not authenticated" });
    if (!outfitId) return res.status(400).json({ message: "Outfit ID required" });

    const outfitRef = db.collection("outfits").doc(outfitId);
    const doc = await outfitRef.get();

    if (!doc.exists) return res.status(404).json({ message: "Outfit not found" });
    if (doc.data().userId !== userId) return res.status(403).json({ message: "Unauthorized" });

    const currentFavorite = doc.data().favorite || false;
    const newFavorite = !currentFavorite;

    await outfitRef.update({ favorite: newFavorite });

    res.status(200).json({
      message: newFavorite ? "Added to favorites" : "Removed from favorites",
      added: newFavorite,
    });

  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({ message: "Failed to update favorite" });
  }
};

// =====================
// UPDATE OUTFIT
// =====================
export const updateOutfit = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { outfitId } = req.params;
    const updateData = req.body;

    if (!userId) return res.status(401).json({ message: "User not authenticated" });
    if (!outfitId) return res.status(400).json({ message: "Outfit ID required" });

    const outfitRef = db.collection("outfits").doc(outfitId);
    const doc = await outfitRef.get();

    if (!doc.exists) return res.status(404).json({ message: "Outfit not found" });
    if (doc.data().userId !== userId) return res.status(403).json({ message: "Unauthorized" });

    await outfitRef.update({
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: "Outfit updated successfully" });

  } catch (error) {
    console.error("Error updating outfit:", error);
    res.status(500).json({ message: "Failed to update outfit" });
  }
};

// =====================
// DELETE OUTFIT
// =====================
export const deleteOutfit = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { outfitId } = req.params;

    if (!userId) return res.status(401).json({ message: "User not authenticated" });
    if (!outfitId) return res.status(400).json({ message: "Outfit ID required" });

    const outfitRef = db.collection("outfits").doc(outfitId);
    const doc = await outfitRef.get();

    if (!doc.exists) return res.status(404).json({ message: "Outfit not found" });
    if (doc.data().userId !== userId) return res.status(403).json({ message: "Unauthorized" });

    await outfitRef.delete();
    res.status(200).json({ message: "Outfit deleted successfully" });

  } catch (error) {
    console.error("Error deleting outfit:", error);
    res.status(500).json({ message: "Failed to delete outfit" });
  }
};