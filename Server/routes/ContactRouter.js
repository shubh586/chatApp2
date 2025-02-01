import express from "express";
const router = express.Router();
import { searchContacts } from "../controllers/ContactsController.js";
import { varifyToken } from "../middleware/Authenticatemiddleware.js";
router.get("/search-contacts", varifyToken, searchContacts);
