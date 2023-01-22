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
                "boy-group",
                "girl-group",
            ],
        }],
        image_url: {
            type: String,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

groupSchema
    .virtual('url')
    .get(function() {
        return `/collections/${this._id}`;
    });

// When this collection is deleted, all items including their 
// comments and likes are soft deleted.
groupSchema.pre('validate', { document: true }, async function (next) {
    console.log(this._id.toString());
    const groupId = this._id.toString();
    try {
        const item_list = await mongoose.model('Item').find({ group: groupId });
        await mongoose.model('Item').updateMany({ group: groupId }, {$set: {isDeleted: true}});
        item_list.forEach(async (item) => {
            try {
                // soft delete the comments
                const comments = await mongoose.model('Comment')
                    .updateMany({ item: item._id }, { $set: { isDeleted: true } });
                console.log(comments.modifiedCount + ' comments were soft deleted');
                // soft delete the likes
                const likes = await mongoose.model('Like')
                    .updateMany({ item: item._id }, { $set: { isDeleted: true } });
                console.log(likes.modifiedCount + ' likes were soft deleted');
            } catch (err) {
                return next(err as any);
            }
        });
        next();
    } catch (err) {
        return next(err as any);
    }
});

const Group = mongoose.model('Group', groupSchema);



export default Group;