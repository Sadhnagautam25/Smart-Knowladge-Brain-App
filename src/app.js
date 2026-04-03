import express, { json } from "express";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express(); // server is create

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // ab sever json format read kr skta hai
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser()); // cookies ko access kr skte h
app.use(express.static(path.join(__dirname, "..", "public")));

// create routes Prifix here ✅
import authRouter from "./routes/auth.routes.js";
import bookmarkRouter from "./routes/bookmark.routes.js";
import resurfaceRouter from "./routes/Resurfacing.routes.js";
import aiRouter from "./routes/ai.routes.js";

app.use("/api/auth", authRouter);
app.use("/api", bookmarkRouter);
app.use("/api", resurfaceRouter);
app.use("/api/ai", aiRouter);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});


app.use(errorMiddleware);
export default app;
