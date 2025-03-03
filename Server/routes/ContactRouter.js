import express from "express";
const router = express.Router();
import { searchContacts,getContacts } from "../controllers/ContactsController.js";
import { varifyToken } from "../middleware/Authenticatemiddleware.js";
router.get("/search-contacts", varifyToken, searchContacts);
router.post("/get-contacts", varifyToken, getContacts);
export default router;
