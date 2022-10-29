import mongoose, { Schema } from "mongoose";

const collectionSchema = new Schema(
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

collectionSchema
    .virtual('url')
    .get(function() {
        return `/collections/${this._id}`;
    });

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;