import prisma from "../config/prisma";

export interface CreateVisitData {
    ip?: string;
    page: string;
    userAgent?: string;
}

export interface VisitStats {
    totalVisits: number;
    uniqueIps: number;
    pageViews: { page: string; count: number }[];
}

export async function createVisit(data: CreateVisitData) {
    return prisma.visit.create({
        data: {
            ip: data.ip,
            page: data.page,
            userAgent: data.userAgent
        }
    });
}

export async function getAllVisits(limit?: number) {
    return prisma.visit.findMany({
        orderBy: { createdAt: "desc" },
        ...(limit && { take: limit })
    });
}

export async function getVisitsByPage(page: string) {
    return prisma.visit.findMany({
        where: { page },
        orderBy: { createdAt: "desc" }
    });
}

export async function getVisitStats(): Promise<VisitStats> {
    const [totalVisits, uniqueIpsResult, pageViewsResult] = await Promise.all([
        prisma.visit.count(),
        prisma.visit.findMany({
            where: { ip: { not: null } },
            distinct: ['ip'],
            select: { ip: true }
        }),
        prisma.visit.groupBy({
            by: ['page'],
            _count: { page: true },
            orderBy: { _count: { page: 'desc' } }
        })
    ]);

    return {
        totalVisits,
        uniqueIps: uniqueIpsResult.length,
        pageViews: pageViewsResult.map(item => ({
            page: item.page,
            count: item._count.page
        }))
    };
}

export async function getVisitsByDateRange(startDate: Date, endDate: Date) {
    return prisma.visit.findMany({
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate
            }
        },
        orderBy: { createdAt: "desc" }
    });
}

export async function getDailyVisitCounts(days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const visits = await prisma.visit.findMany({
        where: {
            createdAt: { gte: startDate }
        },
        select: { createdAt: true }
    });

    // Group by date
    const dailyCounts: Record<string, number> = {};
    visits.forEach(visit => {
        const dateKey: string = visit.createdAt.toISOString().split('T')[0] || "";
        dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
    });

    return Object.entries(dailyCounts)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
}
