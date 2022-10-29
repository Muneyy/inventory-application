import mongoose, { Schema } from "mongoose";

const groupSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        summary: {
            type: String,
            required: true,
        },
        img_url: {
            type: String,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true },
);

groupSchema
    .virtual('url')
    .get(function() {
        return `/collections/${this._id}`;
    });

const Group = mongoose.model('Group', groupSchema);

export default Group;