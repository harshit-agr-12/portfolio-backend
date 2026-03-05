import type { NextFunction , Request , Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export function authMiddleware(req : Request,res : Response, next:NextFunction){
    const token: string = req.headers.authorization?.split(" ")[1] as string;

    const decoded = jwt.verify(token , process.env.JWT_SECRET as string) as JwtPayload;

    if(decoded){
        req.userId = decoded.userId;
        next();
    }

    return res.json({
        message : "access denied"
    })

    next();

}