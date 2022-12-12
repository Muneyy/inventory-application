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
                "boy group",
                "girl group",
                "poster",
                "film",
                "cd",
                "ticket",
            ],
        }],
        images_url: [{
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