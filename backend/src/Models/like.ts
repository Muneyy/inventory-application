import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        item: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            required: true,
        },
    },
    { timestamps: true },
);

likeSchema
    .virtual('url')
    .get(function() {
        return `/likes/${this._id}`;
    });

const Like = mongoose.model('Like', likeSchema);

export default Like;