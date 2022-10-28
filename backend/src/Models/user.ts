import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        bio: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

const User = mongoose.model('User', userSchema);

export default User;