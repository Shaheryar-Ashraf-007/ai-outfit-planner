import express from "express"
import { googleLogin, Login, Signout, Signup } from "../controllers/auth.controller.js";

const router = express.Router()
router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Signout);
router.post("/google-login", googleLogin); // ✅ add this route


export default router