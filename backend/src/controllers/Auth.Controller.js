import Jwt from "jsonwebtoken";
import db from "../config/db.js";
import bcrypt from "bcrypt"

export const Signup = async (req, res) => {
  try {
    const { email, password, name, photoUrl } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Check existing user
    const userRef = db.collection("users");
    const snapshot = await userRef.where("email", "==", email).get();

    if (!snapshot.empty) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUserRef = await db.collection("users").add({
      name,
      email,
      password: hashedPassword,
      photoUrl: photoUrl || null,
      authProvider: "local",
      createdAt: new Date(),
    });

    // JWT Token
    const token = Jwt.sign({ userId: newUserRef.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Response
    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUserRef.id,
        name,
        email,
        photoUrl: photoUrl || null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find User
    const userRef = db.collection("users");
    const snapshot = await userRef.where("email", "==", email).get();

    if (snapshot.empty) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Get User Data
    let userData;
    let userId;

    snapshot.forEach((doc) => {
      userData = doc.data();
      userId = doc.id;
    });

    // Compare Password
    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = Jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Response
    res.status(200).json({
      success: true,
      token,
      user: {
        id: userId,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        photoUrl: userData.photoUrl || null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const Signout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};