import express from "express";
const router = express.Router();
import auth, {
  getUserInfo,
  updateProfile,
} from "../controllers/AuthController.js";
import { varifyToken } from "../middleware/Authenticatemiddleware.js";
const { signUp, signIn } = auth;
router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/get-user", varifyToken, getUserInfo);
router.patch("/update-user", varifyToken, updateProfile);

export default router;
