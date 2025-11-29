import { User } from "../models/user.model.ts";
import type { Request, Response } from "express";

const registerUser = async (req: Request, res: Response) => { // decision maker, handle requests
    try {
        const { username, email, password } = req.body as {
            username: string|null,
            email: string|null,
            password: string|null
        };

        // basic validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required."});
        }

        // check if the user already exists
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({ message: "User already exists." });
        }

        // create user
        const user = await User.create({
            username,
            email: email.toLowerCase(),
            password,
            loggedIn: false,
        });

        res.status(201).json({ 
            message: "User registered successfully!",
            user: { id: user._id, email: user.email, username: user.username }
        })
    } catch (error: any) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

const loginUser = async (req: Request, res: Response) => {
    try {
        // check if the user already exists
        const { email, password } = req.body as {
            email: string|null,
            password: string|null
        };

        if (!email) return res.status(400).json({ message: "Email not provided" });

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(400).json({ message: "User not found" });

        // compare password
        const isMatch = await ((user as any).comparePassword)(password) as boolean;
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        res.status(200).json({
            message: "User Logged in",
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            }
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export {
    registerUser,
    loginUser
}