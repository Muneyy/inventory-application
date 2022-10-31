import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            rqeuired: true,
        },
        bio: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

userSchema
    .virtual('url')
    .get(function() {
        return `/users/${this._id}`;
    });

const User = mongoose.model('User', userSchema);

export default User;