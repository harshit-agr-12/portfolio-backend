import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes"

const app = express();
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.json({ status : "ok"});
});

app.use('/api/auth/login',authRouter)

export default app;