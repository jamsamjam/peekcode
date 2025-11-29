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
            minLength: 3,
            maxLength: 20,
        },

        password: {
            type: String,
            required: true,
            minLength: 6,
            maxLength: 30,
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