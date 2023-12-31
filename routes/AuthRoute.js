import express from "express";
import { loginUser, registerUser } from "../controllers/AuthController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/authenticate", loginUser);

export default router;
