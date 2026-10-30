import { Router } from "express";
import Post from "../models/post.model.js";

const router = Router();

// Create a post
router.post("/", async (req, res) => {
  try {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
      res.status(400).json({
        message: "Title, content, and author are required",
      });
      return;
    }

    const post = await Post.create({
      title,
      content,
      author,
    });

    res.status(201).json({
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create post",
    });
  }
});

// Get all posts
router.get("/", async (_req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve posts",
    });
  }
});

export default router;
