// controllers/auth.controller.js
import Jwt from "jsonwebtoken";
import db from "../config/db.js";
import bcrypt from "bcrypt";
import axios from "axios";

// ── SIGNUP ─────────────────────────────
export const Signup = async (req, res) => {
  try {
    const { email, password, name, photoUrl } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const userRef = db.collection("users");
    const snapshot = await userRef.where("email", "==", email).get();
    if (!snapshot.empty) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserRef = await db.collection("users").add({
      name,
      email,
      password: hashedPassword,
      photoUrl: photoUrl || null,
      authProvider: "local",
      createdAt: new Date(),
    });

    const token = Jwt.sign({ userId: newUserRef.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, { httpOnly: true, sameSite: "Lax", secure: process.env.NODE_ENV === "production", maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(201).json({
      success: true,
      token,
      user: { id: newUserRef.id, name, email, photoUrl: photoUrl || null },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ── LOGIN ──────────────────────────────
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const userRef = db.collection("users");
    const snapshot = await userRef.where("email", "==", email).get();
    if (snapshot.empty) return res.status(400).json({ message: "Invalid email or password" });

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    const userId = userDoc.id;

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = Jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, { httpOnly: true, sameSite: "Lax", secure: process.env.NODE_ENV === "production", maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json({
      success: true,
      token,
      user: { id: userId, name: userData.name, email: userData.email, photoUrl: userData.photoUrl || null },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ── SIGNOUT ────────────────────────────
export const Signout = async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true, sameSite: "Lax", secure: process.env.NODE_ENV === "production" });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Signout Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: "Google access token is required" });
    }

    // 1️⃣ Verify token with Google
    const googleRes = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!googleRes.data) {
      console.log("Google response is empty:", googleRes.data);
      return res.status(400).json({ message: "Failed to fetch Google profile" });
    }

    const profile = googleRes.data;
    const { email, name, picture } = profile;

    if (!email) {
      console.log("No email in Google profile:", profile);
      return res.status(400).json({ message: "Google profile has no email" });
    }

    // 2️⃣ Check if user exists
    const userRef = db.collection("users");
    const snapshot = await userRef.where("email", "==", email).get();

    let userId;
    if (snapshot.empty) {
      // Create new user
      const newUserRef = await userRef.add({
        name,
        email,
        photoUrl: picture || null,
        authProvider: "google",
        createdAt: new Date(),
      });
      userId = newUserRef.id;
      console.log("New Google user created:", userId);
    } else {
      snapshot.forEach((doc) => {
        userId = doc.id;
      });
      console.log("Existing Google user:", userId);
    }

    // 3️⃣ Generate JWT
    const token = Jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // 4️⃣ Respond
    return res.status(200).json({
      success: true,
      token,
      user: { id: userId, name, email, photoUrl: picture || null },
    });

  } catch (err) {
    console.error("Google login error:", err.response?.data || err.message || err);
    return res.status(500).json({ message: "Google login failed" });
  }
};