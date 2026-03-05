import app from "./app";
import { seedAdmin } from "./services/auth.service";

const PORT = process.env.PORT || 3000;

seedAdmin();
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

app.listen(PORT,()=>{
  console.log(`🚀 Server running on port ${PORT}`);
})