import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes"
import blogRouter from "./routes/blog.routes"
import analyticsRouter from "./routes/analytics.routes"

const app = express();
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.json({ status : "ok"});
});

app.use('/api/auth/login',authRouter)
app.use('/api/blogs', blogRouter)
app.use('/api/analytics', analyticsRouter)

export default app;