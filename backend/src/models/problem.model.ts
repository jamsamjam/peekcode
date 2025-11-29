import mongoose, { Schema } from "mongoose"; // schema = structure

const problemSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },

        platform: {
            type: String ,
            enum: ["LeetCode", "NeetCode", "etc"],
            required: true,
        },

        url: String,

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true,
        },
        
        status: {
            type: String,
            enum: ["Solved", "Attempted", "ReviewNeeded", "Skipped"],
            default: "Solved",
        },

        date: Date,
        timeSpent: Number,

        tags: [String],

        notes: String,

        dependency: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },

        createdAt: {
            type: Date,
            default: Date.now,
        }
    }
)

export const Problem = mongoose.model("Problem", problemSchema)