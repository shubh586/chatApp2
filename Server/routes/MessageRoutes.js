import express from "express";
const router = express.Router();
import {getMessages,sendFiles} from "../controllers/MessageController.js";
import { varifyToken } from "../middleware/Authenticatemiddleware.js";
import multer from "multer";
import path from "path";
const upload = multer({ dest: path.join("uploads", "files") });

router.post("/get-messages", varifyToken, getMessages );
router.post("/send-files",varifyToken,upload.single("file"),sendFiles)
export default router;