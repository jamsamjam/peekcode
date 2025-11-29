import { postMessageToThread } from "worker_threads";
import { Problem } from "../models/problem.model.ts";
import { User } from "../models/user.model.ts";
import type { Request, Response } from "express";

const createProblem = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        if (!body.title || !body.platform || !body.difficulty || !body.status) {
            return res.status(400).json({
                message: "All fields are required."
            })
        }

        const problem = await Problem.create({ // exclude what they can't put themselves
            title: body.title,
            platform: body.platform,
            url: body.url,
            difficulty: body.difficulty,
            status: body.status,
            date: body.date,
            timeSpent: body.timeSpent,
            tags: body.tags,
            notes: body.notes,
            dependency: body.dependency,
        });

        await User.findByIdAndUpdate(
            req.user!._id,
            { $push: { problems: problem._id } }
        );

        res.status(201).json({
            message: "Problem created successfully", problem
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error", error
        })
    }
}

const getProblems = async (req: Request, res: Response) => {
    try {
        const getProblems = await Problem.find();
        res.status(200).json(getProblems);
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error", error
        })
    }
}

const updateProblem = async (req: Request, res: Response) => {
    try {
        // basic validation to check if the body is empty, truthy {} is not reliable
        if (Object.keys(req.body).length === 0) {
            res.status(400).json({
                message: "No data provided for update"
            })
        }

        const body = req.body;

        const problem = await Problem.findByIdAndUpdate(req.params.id, {
            title: body.title,
            platform: body.platform,
            url: body.url,
            difficulty: body.difficulty,
            status: body.status,
            date: body.date,
            timeSpent: body.timeSpent,
            tags: body.tags,
            notes: body.notes,
            dependency: body.dependency,
        }, { new: true });

        if (!problem) return res.status(404).json({ message: "Problem not found" });

        res.status(200).json({
            message: "Problem updated successfully", problem
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error", error
        })
    }
}

const deleteProblem = async (req: Request, res: Response) => {
    try {
        const deleted = await Problem.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Problem not found" });

        res.status(200).json({
            message: "Problem deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error", error
        })
    }
}

export {
    createProblem,
    getProblems,
    updateProblem,
    deleteProblem
}