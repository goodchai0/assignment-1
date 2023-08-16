import express from "express";
import {
  followUser,
  getUser,
  unfollowUser,
} from "../controllers/UserController.js";
import authMiddleWare from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/user", authMiddleWare, getUser);
router.post("/follow/:id", authMiddleWare, followUser);
router.post("/unfollow/:id", authMiddleWare, unfollowUser);

export default router;
