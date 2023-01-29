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
const itemSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Group',
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    likeCounter: {
        type: Number,
    },
    likeUsers: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Like',
        }],
    commentCounter: {
        type: Number,
    },
    commentUsers: [{
            type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: true });
itemSchema
    .virtual('url')
    .get(function () {
    return `/items/${this._id}`;
});
// itemSchema.pre('save', function (next) {
//     if (!this.isDeleted) {
//         this.isDeleted = false;
//     }
//     next();
// });
itemSchema.pre('validate', { document: true }, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const itemId = this._id.toString();
        try {
            // soft delete the comments
            const comments = yield mongoose_1.default.model('Comment')
                .updateMany({ item: itemId }, { $set: { isDeleted: true } });
            console.log(comments.modifiedCount + ' comments were soft deleted');
            // soft delete the likes
            const likes = yield mongoose_1.default.model('Like')
                .updateMany({ item: itemId }, { $set: { isDeleted: true } });
            console.log(likes.modifiedCount + ' likes were soft deleted');
            yield mongoose_1.default.model('Item').findByIdAndUpdate(itemId, {
                $set: { isDeleted: true },
            });
            next();
        }
        catch (err) {
            return next(err);
        }
    });
});
const Item = mongoose_1.default.model('Item', itemSchema);
exports.default = Item;
