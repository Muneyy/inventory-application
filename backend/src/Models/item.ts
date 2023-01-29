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
        isDeleted: {
            type: Boolean,
            default: false,
        },
        category: {
            type: String,
            enum: [
                "display",
                "selling",
                "buying",
            ],
        },
    },
    { timestamps: true },
);

itemSchema
    .virtual('url')
    .get(function() {
        return `/items/${this._id}`;
    });

// itemSchema.pre('save', function (next) {
//     if (!this.isDeleted) {
//         this.isDeleted = false;
//     }
//     next();
// });

// itemSchema.pre('validate', { document: true }, async function (next) {
//     const itemId = this._id.toString();
//     try {
//     // soft delete the comments
//         const comments = await mongoose.model('Comment')
//             .updateMany({ item: itemId }, { $set: { isDeleted: true } });
//         console.log(comments.modifiedCount + ' comments were soft deleted');
//         // soft delete the likes
//         const likes = await mongoose.model('Like')
//             .updateMany({ item: itemId }, { $set: { isDeleted: true } });
//         console.log(likes.modifiedCount + ' likes were soft deleted');
//         await mongoose.model('Item').findByIdAndUpdate(itemId, {
//             $set: { isDeleted: true},
//         });
//         next();
//     } catch (err) {
//         return next(err as any);
//     }
// });

const Item = mongoose.model('Item', itemSchema);

export default Item;