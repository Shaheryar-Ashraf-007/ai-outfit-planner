// services/authService.js
import axios from "axios";

const API_BASE = "http://localhost:3000/api/auth";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const getErrorMsg = (err) => {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.response?.data?.error) return err.response.data.error;
  if (err?.message === "Network Error")
    return "Cannot connect to server. Please try again.";
  return "Something went wrong. Please try again.";
};

export const loginUser = async ({ email, password }) => {
  try {
    const res = await api.post("/login", { email, password });
    const { token, user } = res.data;
    if (token) localStorage.setItem("token", token);
    if (user) localStorage.setItem("user", JSON.stringify(user));
    return { success: true, user, token };
  } catch (err) {
    return { success: false, message: getErrorMsg(err) };
  }
};

export const signupUser = async ({ name, email, password }) => {
  try {
    const res = await api.post("/signup", { name, email, password });
    const { token, user } = res.data;
    if (token) localStorage.setItem("token", token);
    if (user) localStorage.setItem("user", JSON.stringify(user));
    return { success: true, user, token };
  } catch (err) {
    return { success: false, message: getErrorMsg(err) };
  }
};

export const logoutUser = async () => {
  try {
    await api.post("/logout");
  } catch (error) {
    ("Error: ");
    error;
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const isLoggedIn = () => !!localStorage.getItem("token");
