import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        tags: [{
            type: String,
            enums: [
                "apparel",
                "photocard",
                "lightstick",
                "album",
                "poster",
                "film",
                "cd",
                "ticket",
                "card",
                "peripheral",
                "stationery",
            ],
        }],
        price: {
            type: Number,
            required: true,
        },
        images_urls: [{
            type: String,
        }],
        group: {
            type: Schema.Types.ObjectId,
            ref: 'Group',
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        likeCounter: {
            type: Number,
        },
        likeUsers: [{
            type: Schema.Types.ObjectId,
            ref: 'Like',
        }],
        commentCounter: {
            type: Number,
        },
        commentUsers: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        }],
    },
    { timestamps: true },
);

itemSchema
    .virtual('url')
    .get(function() {
        return `/items/${this._id}`;
    });

const Item = mongoose.model('Item', itemSchema);

export default Item;