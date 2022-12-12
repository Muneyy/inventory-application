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
        tags: [{
            type: String,
            enums: [
                "k-pop",
                "j-pop",
                "p-pop",
                "soloist",
                "boy group",
                "girl group",
            ],
        }],
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