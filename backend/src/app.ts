import express from "express";

const app = express();

app.use(express.json());

import userRouter from './routes/user.route.js';
import problemRouter from './routes/problem.route.js';

app.use("/api/v1/users", userRouter);
app.use("/api/v1/problems", problemRouter);

// api/vi/users/register

export default app;