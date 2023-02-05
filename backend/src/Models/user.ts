import mongoose, { Schema } from "mongoose";
import Friend from "./friend";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        handle: {
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
        email: {
            type: String,
            required: true,
        },
        friends: [{
            type: Schema.Types.ObjectId,
            ref: 'Friend',
        }],
        avatarURL: {
            type: String,
        },
    },
    { timestamps: true },
);

userSchema
    .virtual('url')
    .get(function() {
        return `/users/${this._id}`;
    });

// Add a friend request to newly created users.
userSchema.post('save', async function (next: any) {
    const userId = this._id.toString();
    try {
        const docA = await Friend.findOneAndUpdate(
            { requester: "637f5e46a8d57dadbac5a76c", recipient: userId},
            { $set: { status: 1 }},
            { upsert: true, new: true},
        );
        const docB = await Friend.findOneAndUpdate(
            { requester: userId, recipient: "637f5e46a8d57dadbac5a76c"},
            { $set: { status: 2 }},
            { upsert: true, new: true},
        );
        const updateUserRequester = await User.findOneAndUpdate(
            { _id: "637f5e46a8d57dadbac5a76c" },
            { $push: { friends: docA._id }},
        );
        const updateUserRecipient = await User.findOneAndUpdate(
            { _id: userId },
            { $push: { friends: docB._id }},
        );
    }
    catch (err) {
        console.log(next);
        return next(err);
    }
});

const User = mongoose.model('User', userSchema);

export default User;