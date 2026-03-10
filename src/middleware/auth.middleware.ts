import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        if (decoded && decoded.userId) {
            req.userId = decoded.userId;
            return next();
        }

        return res.status(401).json({
            message: "Invalid token"
        });
    } catch (error) {
        return res.status(401).json({
            message: "Access denied - Invalid or expired token"
        });
    }
}