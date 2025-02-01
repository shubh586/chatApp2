import express from "express";

import multer from "multer";
const uploads = multer({ dest: "uploads" });

const router = express.Router();

import auth, {
  getUserInfo,
  updateProfile,
  addProfileImage,
  deleteProfileImage,
  logOutUser,
} from "../controllers/AuthController.js";
import { varifyToken } from "../middleware/Authenticatemiddleware.js";
const { signUp, signIn } = auth;
router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/get-user", varifyToken, getUserInfo);
router.patch("/update-user", varifyToken, updateProfile);
router.patch(
  "/add-profile-image",
  varifyToken,
  uploads.single("profile-image"),
  addProfileImage
);
router.delete("/delete-profile-image", varifyToken, deleteProfileImage);
router.post("/log-out", varifyToken, logOutUser);
export default router;
