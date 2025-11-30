import { model, Schema, type InferRawDocType } from "mongoose"; // schema = structure

const schemaDefinition = {
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    title: {
        type: String,
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
        required: true,
        default: "Solved",
    },

    date: {
        type: Date,
        default: Date.now,
    },

    timeSpent: Number, // in mins

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

const problemSchema = new Schema(schemaDefinition)

export type ProblemType = InferRawDocType<typeof schemaDefinition>
export const Problem = model("Problem", problemSchema)
