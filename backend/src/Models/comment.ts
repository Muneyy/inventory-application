import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
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
        text: {
            type: String,
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

commentSchema.pre('save', function (next) {
    if (!this.isDeleted) {
        this.isDeleted = false;
    }
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;