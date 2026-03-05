import prisma from "../config/prisma";
import bcrypt from "bcrypt";

export async function seedAdmin(){
    const existing = await prisma.admin.findFirst();
    if(existing) return;

    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD! as string,10);

    await prisma.admin.create({
        data : {
            email : process.env.ADMIN_EMAIL as string,
            passowrd : hashed
        }
    })

    console.log("ADMIN SEEDED");
}

export async function adminExist(email : string , passowrd : string){
    const user = await prisma.admin.findUnique({
        where : {
            email : email
        }
    })

    const decoded = await bcrypt.compare(passowrd,user?.passowrd as string)

    return decoded
}


export async function existingUser(email : string){

    try{
        const user =  await prisma.admin.findFirst({
        where : {
            email : email
        }
        })
        return user;
    }catch(err){
        return null;
    }
    
}