import { User } from "../models/user.model.js";
import type { Request, Response } from "express";

const getUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id;
        const user = await User.findById(userId, "_id username email");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error", error
        })
    }
}

const createMemo = async (req: Request, res: Response) => {
   try {
        const body = req.body;

        if (!body || Object.keys(body).length === 0 || typeof body.content !== 'string') {
            return res.status(400).json({ message: "Invalid memo content" });
        }

        await User.findByIdAndUpdate(
            req.user!._id,
            { $push: { memo: body } }
        );

        res.status(201).json({ 
            message: "Memo created successfully"
        });
   } catch (error) {
        res.status(500).json({ 
            message: "Internal Server Error", error
        });
   }
}

const getMemo = async (req: Request, res: Response) => {
    try {
        const userId = req.user!._id;
        const user = await User.findById(userId, "memo");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ memo: user.memo || ""});
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error", error
        })
    }
}

export { 
    getUser,
    createMemo,
    getMemo,
};