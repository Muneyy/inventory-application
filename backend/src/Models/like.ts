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
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

likeSchema
    .virtual('url')
    .get(function() {
        return `/likes/${this._id}`;
    });

likeSchema.pre('save', function (next) {
    if (!this.isDeleted) {
        this.isDeleted = false;
    }
    next();
});

const Like = mongoose.model('Like', likeSchema);

export default Like;