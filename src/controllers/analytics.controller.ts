import type { Request, Response } from "express";
import {
    createVisit,
    getAllVisits,
    getVisitsByPage,
    getVisitStats,
    getVisitsByDateRange,
    getDailyVisitCounts
} from "../services/analytics.service";

// Track a page visit
export async function trackVisitController(req: Request, res: Response) {
    const { page } = req.body;

    if (!page) {
        return res.status(400).json({
            message: "Page is required"
        });
    }

    try {
        const ip = req.ip || req.headers['x-forwarded-for'] as string || undefined;
        const userAgent = req.headers['user-agent'] || undefined;

        const visit = await createVisit({ ip, page, userAgent });

        return res.status(201).json({
            message: "Visit tracked successfully",
            visit
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error tracking visit",
            error: err
        });
    }
}

// Get all visits (admin only)
export async function getAllVisitsController(req: Request, res: Response) {
    const { limit } = req.query;

    try {
        const visits = await getAllVisits(limit ? parseInt(limit as string) : undefined);

        return res.status(200).json({
            visits
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error fetching visits",
            error: err
        });
    }
}

// Get visits for a specific page
export async function getVisitsByPageController(req: Request, res: Response) {
    const { page } = req.params;

    try {
        const visits = await getVisitsByPage(decodeURIComponent(page as string));

        return res.status(200).json({
            visits
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error fetching page visits",
            error: err
        });
    }
}

// Get visit statistics
export async function getVisitStatsController(req: Request, res: Response) {
    try {
        const stats = await getVisitStats();

        return res.status(200).json({
            stats
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error fetching visit stats",
            error: err
        });
    }
}

// Get visits by date range
export async function getVisitsByDateRangeController(req: Request, res: Response) {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({
            message: "startDate and endDate are required"
        });
    }

    try {
        const visits = await getVisitsByDateRange(
            new Date(startDate as string),
            new Date(endDate as string)
        );

        return res.status(200).json({
            visits
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error fetching visits by date range",
            error: err
        });
    }
}

// Get daily visit counts for the last N days
export async function getDailyVisitCountsController(req: Request, res: Response) {
    const { days } = req.query;

    try {
        const dailyCounts = await getDailyVisitCounts(days ? parseInt(days as string) : 7);

        return res.status(200).json({
            dailyCounts
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error fetching daily visit counts",
            error: err
        });
    }
}
