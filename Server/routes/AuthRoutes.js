import express from "express";
const router = express.Router();
import auth from "../controllers/AuthController.js";
const { signUp, signIn } = auth;
router.post("/signup", signUp);
router.post("/signin", signIn);
export default router;
