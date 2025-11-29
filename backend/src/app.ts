import express from "express";
import cors from 'cors';
import 'dotenv/config';

const app = express();

app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL,
  }));

import userRouter from './routes/auth.route.ts';
import problemRouter from './routes/problem.route.js';
import authenticateToken from "./middlewares/auth.middleware.ts";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/problems", authenticateToken, problemRouter);

// api/vi/users/register

export default app;