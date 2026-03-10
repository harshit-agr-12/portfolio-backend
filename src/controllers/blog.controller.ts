import type { Request, Response } from "express";
import {
    createBlog,
    findBlogBySlug,
    findBlogById,
    getAllBlogs,
    updateBlog,
    deleteBlog
} from "../services/blog.service";
import { generateSlug } from "../utils/generateSlug";

// Create a new blog post
export async function createBlogController(req: Request, res: Response) {
    const { title, content, isPublished } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            message: "Title and content are required"
        });
    }

    try {
        const slug = generateSlug(title);

        // Check if slug already exists
        const existingBlog = await findBlogBySlug(slug);

        if (existingBlog) {
            return res.status(409).json({
                message: "A blog with this title already exists"
            });
        }

        const blog = await createBlog({ title, content, isPublished });

        return res.status(201).json({
            message: "Blog created successfully",
            blog
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error creating blog",
            error: err
        });
    }
}

// Get all blogs (with optional filter for published only)
export async function getAllBlogsController(req: Request, res: Response) {
    const { published } = req.query;

    try {
        const blogs = await getAllBlogs(published === "true");

        return res.status(200).json({
            blogs
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error fetching blogs",
            error: err
        });
    }
}

// Get a single blog by slug
export async function getBlogBySlugController(req: Request, res: Response) {
    const { slug } = req.params;

    try {
        const blog = await findBlogBySlug(slug as string);

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        return res.status(200).json({
            blog
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error fetching blog",
            error: err
        });
    }
}

// Update a blog by id
export async function updateBlogController(req: Request, res: Response) {
    const { id } = req.params;
    const { title, content, isPublished } = req.body;

    try {
        const existingBlog = await findBlogById(id as string);

        if (!existingBlog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        // Check if new slug conflicts with another blog
        if (title) {
            const newSlug = generateSlug(title);
            if (newSlug !== existingBlog.slug) {
                const slugExists = await findBlogBySlug(newSlug);

                if (slugExists) {
                    return res.status(409).json({
                        message: "A blog with this title already exists"
                    });
                }
            }
        }

        const blog = await updateBlog(id as string, { title, content, isPublished }, existingBlog.slug);

        return res.status(200).json({
            message: "Blog updated successfully",
            blog
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error updating blog",
            error: err
        });
    }
}

// Delete a blog by id
export async function deleteBlogController(req: Request, res: Response) {
    const { id } = req.params ;


    try {
        const existingBlog = await findBlogById(id as string);

        if (!existingBlog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        await deleteBlog(id as string);

        return res.status(200).json({
            message: "Blog deleted successfully"
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error deleting blog",
            error: err
        });
    }
}


export async function getAllPublishedBlogsController(req: Request, res: Response) {
    try {
        const blogs = await getAllBlogs(true);

        return res.status(200).json({
            blogs: blogs.filter(blog => blog.isPublished)
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error fetching published blogs",
            error: err
        });
    }
}

export async function getPublishedBlogBySlugController(req: Request, res: Response) {
    const { slug } = req.params;

    try {
        const blog = await findBlogBySlug(slug as string);

        if (!blog || !blog.isPublished) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        return res.status(200).json({
            blog
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error fetching published blog",
            error: err
        });
    }
}