import express from "express";
import {
    trackVisitController,
    getAllVisitsController,
    getVisitsByPageController,
    getVisitStatsController,
    getVisitsByDateRangeController,
    getDailyVisitCountsController
} from "../controllers/analytics.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// Public route - track visits
router.post("/track", trackVisitController);  // POST /analytics/track - Track a page visit

// Protected routes (require authentication)
router.get("/", authMiddleware, getAllVisitsController);                    // GET /analytics - Get all visits
router.get("/stats", authMiddleware, getVisitStatsController);              // GET /analytics/stats - Get visit statistics
router.get("/daily", authMiddleware, getDailyVisitCountsController);        // GET /analytics/daily - Get daily visit counts
router.get("/range", authMiddleware, getVisitsByDateRangeController);       // GET /analytics/range - Get visits by date range
router.get("/page/:page", authMiddleware, getVisitsByPageController);       // GET /analytics/page/:page - Get visits for a page

export default router;
