import express from "express";
import { loginUser, signupUser } from "../controllers/userController";

const router = express.Router();

// Login
router.post("/login", loginUser);

// Signup Route
router.post("/signup", signupUser);

export default router;
