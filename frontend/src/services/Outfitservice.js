// services/outfitService.js
import axios from "axios";

const OUTFIT_BASE = "http://localhost:3000/api/outfit";
const SAVE_BASE   = "http://localhost:3000/api/data";

/* ─────────────────────────────────────────────
   Axios instances with auth interceptor
───────────────────────────────────────────── */
const createApi = (baseURL) => {
  const instance = axios.create({ baseURL, withCredentials: true });
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  return instance;
};

const outfitApi = createApi(OUTFIT_BASE);
const saveApi   = createApi(SAVE_BASE);

/* ─────────────────────────────────────────────
   GENERATE OUTFIT
   POST /api/outfit/generate
───────────────────────────────────────────── */
export const generateOutfit = async ({
  photo,
  event,
  style,
  gender,
  season,
  height,
  skinTone,
  bodyType,
}) => {
  try {
    const formData = new FormData();
    if (photo) formData.append("photo", photo);
    formData.append("event",   event);
    formData.append("style",   style);
    formData.append("gender",  gender);
    formData.append("season",  season);
    formData.append("height",  String(height));
    if (skinTone) formData.append("skinTone", skinTone);
    if (bodyType) formData.append("bodyType", bodyType);

    const res = await outfitApi.post("/generate", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return { success: true, data: res.data.data };

  } catch (err) {
    const msg = err?.response?.data?.message || "Failed to generate outfit. Please try again.";
    return { success: false, message: msg };
  }
};

/* ─────────────────────────────────────────────
   REGENERATE OUTFIT
   POST /api/outfit/regenerate
───────────────────────────────────────────── */
export const regenerateOutfit = async ({
  event,
  style,
  gender,
  season,
  height,
  skinTone,
  bodyType,
  excludeTitles  = [],
  moodAdjustment = "",
}) => {
  try {
    const res = await outfitApi.post("/regenerate", {
      event, style, gender, season, height,
      skinTone, bodyType, excludeTitles, moodAdjustment,
    });

    return { success: true, data: res.data.data };

  } catch (err) {
    const msg = err?.response?.data?.message || "Failed to regenerate outfit. Please try again.";
    return { success: false, message: msg };
  }
};

/* ─────────────────────────────────────────────
   GET MY SAVED OUTFITS
   GET /api/data/my
───────────────────────────────────────────── */
export const getMySavedOutfits = async () => {
  try {
    const res  = await saveApi.get("/my");
    const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
    return { success: true, data };

  } catch (err) {
    const msg = err?.response?.data?.message || "Failed to fetch outfits.";
    return { success: false, message: msg };
  }
};

/* ─────────────────────────────────────────────
   GET FAVORITE OUTFITS
   GET /api/data/favorites
───────────────────────────────────────────── */
export const getFavoriteOutfits = async () => {
  try {
    const res  = await saveApi.get("/favorites");
    const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
    return { success: true, data };

  } catch (err) {
    const msg = err?.response?.data?.message || "Failed to fetch favorites.";
    return { success: false, message: msg };
  }
};

/* ─────────────────────────────────────────────
   TOGGLE FAVORITE
   POST /api/data/favorite/:outfitId
───────────────────────────────────────────── */
export const toggleFavoriteOutfit = async (outfitId) => {
  try {
    const res = await saveApi.post(`/favorite/${outfitId}`);
    return { success: true, added: res.data?.added };

  } catch (err) {
    const msg = err?.response?.data?.message || "Failed to update favorite.";
    return { success: false, message: msg };
  }
};

/* ─────────────────────────────────────────────
   DELETE OUTFIT
   DELETE /api/data/:outfitId
───────────────────────────────────────────── */
export const deleteSavedOutfit = async (outfitId) => {
  try {
    await saveApi.delete(`/${outfitId}`);
    return { success: true };

  } catch (err) {
    const msg = err?.response?.data?.message || "Failed to delete outfit.";
    return { success: false, message: msg };
  }
};

/* ─────────────────────────────────────────────
   UPDATE OUTFIT
   PUT /api/data/:outfitId
───────────────────────────────────────────── */
export const updateSavedOutfit = async (outfitId, updateData) => {
  try {
    const res = await saveApi.put(`/${outfitId}`, updateData);
    return { success: true, data: res.data };

  } catch (err) {
    const msg = err?.response?.data?.message || "Failed to update outfit.";
    return { success: false, message: msg };
  }
};