import {PrismaClient} from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg";


const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({connectionString});

const prisma = new PrismaClient({
    adapter
});

// const prisma = new PrismaClient({
//     adapter : new PrismaPg(process.env.DATABASE_URL)
// });

export default prisma;