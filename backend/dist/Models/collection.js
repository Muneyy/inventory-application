"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const groupSchema = new mongoose_1.Schema({
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
            unique: true,
            enum: [
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
groupSchema
    .virtual('url')
    .get(function () {
    return `/collections/${this._id}`;
});
groupSchema.pre('save', function (next) {
    if (!this.isDeleted) {
        this.isDeleted = false;
    }
    next();
});
// When this collection is deleted, all items including their 
// comments and likes are soft deleted.
// This deletes collection and everything else referenced to it.
groupSchema.pre('validate', { document: true }, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const groupId = this._id.toString();
        try {
            const item_list = yield mongoose_1.default.model('Item').find({ group: groupId });
            yield mongoose_1.default.model('Item').updateMany({ group: groupId }, { $set: { isDeleted: true } });
            item_list.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                try {
                    // soft delete the comments
                    const comments = yield mongoose_1.default.model('Comment')
                        .updateMany({ item: item._id }, { $set: { isDeleted: true } });
                    console.log(comments.modifiedCount + ' comments were soft deleted');
                    // soft delete the likes
                    const likes = yield mongoose_1.default.model('Like')
                        .updateMany({ item: item._id }, { $set: { isDeleted: true } });
                    console.log(likes.modifiedCount + ' likes were soft deleted');
                }
                catch (err) {
                    return next(err);
                }
            }));
            yield mongoose_1.default.model('Group').updateOne({ _id: groupId }, { $set: { isDeleted: true } });
            next();
        }
        catch (err) {
            return next(err);
        }
    });
});
const Group = mongoose_1.default.model('Group', groupSchema);
exports.default = Group;
