import type { Request, Response } from "express";
import { existingUser} from "../services/auth.service"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export async function loginController(req:Request,res:Response){
    const email: string = req.body?.email as string;
    const password : string = req.body?.password as string;



    try{
        const user = await existingUser(email as string);

        if(!user) return res.json({
            message : "fuck of"
        })

        const same = await bcrypt.compare(password , user.passowrd)

        if(!same) {
                return res.status(403).json({
                message : "unauthorized access denied"
            })
        }
        const token = jwt.sign({userId : user.id} , process.env.JWT_SECRET as string)

        return res.status(200).json({
            token : token
        })
        
    }catch(err){
        res.status(500).json({
            message : err
        });
    }
}