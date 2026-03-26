import axios from "axios";

const API_BASE = "http://localhost:3000/api/auth";

/* ── axios instance with defaults ── */
const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,          // send cookies if your backend uses them
});

/* ── attach token to every request if present ── */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ── normalise error messages ── */
const getErrorMsg = (err) => {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.response?.data?.error)   return err.response.data.error;
  if (err?.message === "Network Error") return "Cannot connect to server. Please try again.";
  return "Something went wrong. Please try again.";
};

/* ────────────────────────────────────────
   LOGIN
   POST /api/auth/login
   Body: { email, password }
   Returns: { token, user }
──────────────────────────────────────── */
export const loginUser = async ({ email, password }) => {
  try {
    const res = await api.post("/login", { email, password });
    const { token, user } = res.data;
    if (token) localStorage.setItem("token", token);
    if (user)  localStorage.setItem("user",  JSON.stringify(user));
    return { success: true, user, token };
  } catch (err) {
    return { success: false, message: getErrorMsg(err) };
  }
};

/* ────────────────────────────────────────
   SIGNUP
   POST /api/auth/signup  (or /register — change below if needed)
   Body: { name, email, password }
   Returns: { token, user }
──────────────────────────────────────── */
export const signupUser = async ({ name, email, password }) => {
  try {
    const res = await api.post("/signup", { name, email, password });
    const { token, user } = res.data;
    if (token) localStorage.setItem("token", token);
    if (user)  localStorage.setItem("user",  JSON.stringify(user));
    return { success: true, user, token };
  } catch (err) {
    return { success: false, message: getErrorMsg(err) };
  }
};



/* ────────────────────────────────────────
   LOGOUT
   Clears local storage + optionally calls
   the backend to invalidate the session.
──────────────────────────────────────── */
export const logoutUser = async () => {
  try {
    await api.post("/logout");
  } catch (error) {
    // silent — still clear local state
    console.log("error: ",error)
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};

/* ────────────────────────────────────────
   GET CURRENT USER from localStorage
──────────────────────────────────────── */
export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const isLoggedIn = () => !!localStorage.getItem("token");