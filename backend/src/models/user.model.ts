import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minLength: [3, "Username must be at least 3 characters long."],
            maxLength: [20, "Username can't exceed 20 characters."],
        },

        password: {
            type: String,
            required: true,
            minLength: [6, "Password must be at least 6 characters long."],
            maxLength: [30, "Password can't exceed 30 characters."],
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            // email format
        },

        loggedIn: {
            type: Boolean,
        },

        problems: [{
            type: Schema.Types.ObjectId,
            ref: 'Problem'
        }],

        memo: {
            type: String,
        }
    },

    {
        timestamps: true
    }
)

// hash password, apparently next() is gone
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// compare passwords
userSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password)
}

export const User = model("User", userSchema)