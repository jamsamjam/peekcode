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

const updateMemo = async (req: Request, res: Response) => {
   try {
        const { content } = req.body;

        if (typeof content !== 'string') {
            return res.status(400).json({ message: "Invalid memo content" });
        }

        await User.findByIdAndUpdate(
            req.user!._id,
            { $set: { memo: content } }
        );

        res.status(200).json({ 
            message: "Memo updated successfully"
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
    updateMemo,
    getMemo,
};