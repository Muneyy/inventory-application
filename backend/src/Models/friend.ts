import mongoose, { Schema } from "mongoose";

const friendSchema = new Schema(
    {
        requester: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        recipient: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: Number,
            enums: [
                0, // add friend
                1, // requested
                2, // pending
                3, // friends
            ],
        },
    },
    { timestamps: true },
);

const Friend = mongoose.model('Friend', friendSchema);

export default Friend;