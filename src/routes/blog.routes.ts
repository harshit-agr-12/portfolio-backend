import express from "express";
import {
    createBlogController,
    getAllBlogsController,
    getBlogBySlugController,
    updateBlogController,
    deleteBlogController,
    getPublishedBlogBySlugController,
    getAllPublishedBlogsController
} from "../controllers/blog.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// Public routes
router.get("/", authMiddleware,  getAllBlogsController);           // GET /blogs - Get all blogs

router.get("/published", authMiddleware, getAllPublishedBlogsController);  // GET /blogs/published - Get only published blogs
router.get("/:slug", authMiddleware, getBlogBySlugController);    // GET /blogs/:slug - Get blog by slug

router.get('/published/:slug', getPublishedBlogBySlugController) // GET /blogs/published/:slug - Get published blog by slug

// Protected routes (require authentication)
router.post("/", authMiddleware, createBlogController);       // POST /blogs - Create blog
router.put("/:id", authMiddleware, updateBlogController);     // PUT /blogs/:id - Update blog
router.delete("/:id", authMiddleware, deleteBlogController);  // DELETE /blogs/:id - Delete blog

export default router;
