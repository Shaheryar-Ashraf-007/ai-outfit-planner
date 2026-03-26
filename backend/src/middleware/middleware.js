import Jwt from "jsonwebtoken";
import db from "../config/db.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from cookies
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    // Verify token
    const decoded = Jwt.verify(token, process.env.JWT_SECRET);

    // Get user from Firestore
    const userDoc = await db
      .collection("users")
      .doc(decoded.userId)
      .get();

    if (!userDoc.exists) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Attach user to request
    req.user = {
      id: userDoc.id,
      ...userDoc.data(),
      password: undefined, // hide password
    };

    next();

  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};