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

export { getUser };