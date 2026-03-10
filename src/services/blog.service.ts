import prisma from "../config/prisma";
import { generateSlug } from "../utils/generateSlug";

export interface CreateBlogData {
    title: string;
    content: string;
    isPublished?: boolean;
}

export interface UpdateBlogData {
    title?: string;
    content?: string;
    isPublished?: boolean;
}

export async function findBlogBySlug(slug: string) {
    return prisma.blog.findUnique({
        where: { slug }
    });
}

export async function findBlogById(id: string) {
    return prisma.blog.findUnique({
        where: { id }
    });
}

export async function createBlog(data: CreateBlogData) {
    const slug = generateSlug(data.title);

    return prisma.blog.create({
        data: {
            title: data.title,
            content: data.content,
            slug,
            isPublished: data.isPublished ?? false
        }
    });
}

export async function getAllBlogs(publishedOnly: boolean = false) {
    return prisma.blog.findMany({
        where: publishedOnly ? { isPublished: true } : {},
        orderBy: { createdAt: "desc" }
    });
}

export async function updateBlog(id: string, data: UpdateBlogData, currentSlug: string) {
    const slug = data.title ? generateSlug(data.title) : currentSlug;

    return prisma.blog.update({
        where: { id },
        data: {
            ...(data.title && { title: data.title, slug }),
            ...(data.content && { content: data.content }),
            ...(typeof data.isPublished === "boolean" && { isPublished: data.isPublished })
        }
    });
}

export async function deleteBlog(id: string) {
    return prisma.blog.delete({
        where: { id }
    });
}
