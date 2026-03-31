// services/ImageServices.js
import axios from "axios";

const API_BASE = "http://localhost:3000/api/image";

const api = axios.create({ baseURL: API_BASE });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const generateOutfitImages = async (outfits, userProfile) => {
  try {
    const res = await api.post("/generate-outfit-images", {
      outfits,
      userProfile,
    });

    return {
      success: true,
      data: res.data.data,
    };

  } catch (err) {
    console.error("Image API Error:", err?.response?.data || err);
    return {
      success: false,
      message: err?.response?.data?.message || "Error generating images",
    };
  }
};