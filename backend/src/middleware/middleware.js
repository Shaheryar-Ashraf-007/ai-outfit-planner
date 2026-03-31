import Jwt from "jsonwebtoken"
export const protect = async (req, res, next) => {
  try {
    if (req.method === "OPTIONS") return next();

    let token;
    console.log("AUTH HEADER RECEIVED:", req.headers.authorization);

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return res.status(401).json({ message: "Not authorized, no token" });

    const decoded = Jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED TOKEN:", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Protect middleware error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};