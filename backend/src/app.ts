import express from "express";
import cors from 'cors';
import 'dotenv/config';

const app = express();

app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL,
  }));

import authRouter from './routes/auth.route.js';
import problemRouter from './routes/problem.route.js';
import userRouter from './routes/user.route.js';
import authenticateToken from "./middlewares/auth.middleware.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/problems", authenticateToken, problemRouter);
app.use("/api/v1/user", authenticateToken, userRouter);

export default app;