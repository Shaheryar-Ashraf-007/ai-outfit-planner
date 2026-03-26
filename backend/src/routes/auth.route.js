import express from "express"
import { Login, Signout, Signup } from "../controllers/auth.controller.js";

const router = express.Router()
router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Signout);

export default router