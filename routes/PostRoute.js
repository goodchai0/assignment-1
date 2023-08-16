import express from "express";
import {
  addComment,
  createPost,
  deletePost,
  dislikePost,
  getPost,
  getTimelinePosts,
  likePost,
} from "../controllers/PostController.js";
import authMiddleWare from "../middleware/AuthMiddleware.js";
// import authMiddleWare from "../middleware/AuthMiddleware.js";
const router = express.Router();

router.get("/posts/:id", getPost);
router.post("/posts/", authMiddleWare, createPost);
router.post("/like/:id", authMiddleWare, likePost);
router.post("/dislike/:id/", authMiddleWare, dislikePost);
router.post("/comment/:id/", authMiddleWare, addComment);
router.get("/all_posts", authMiddleWare, getTimelinePosts);
router.delete("/:id", deletePost);

export default router;
