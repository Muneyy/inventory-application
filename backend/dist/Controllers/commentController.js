"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const item_1 = __importDefault(require("../Models/item"));
const user_1 = __importDefault(require("../Models/user"));
const comment_1 = __importDefault(require("../Models/comment"));
const unescapeString_1 = __importDefault(require("./unescapeString"));
exports.item_comments = (req, res, next) => {
    comment_1.default.find({ item: req.params.itemId, isDeleted: false })
        .populate({
        path: 'user',
        model: user_1.default,
        select: ['username', 'handle', 'avatarURL'],
    })
        .sort([['createdAt', 'descending']])
        .exec((err, list_comments) => {
        if (err) {
            return next(err);
        }
        list_comments.forEach((comment) => {
            comment.text = (0, unescapeString_1.default)(comment.text);
        });
        res.send(list_comments);
    });
};
exports.add_comment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userRequester = req.body.commenter;
    const itemCommented = req.params.itemId;
    const createCommentDocument = yield comment_1.default.findOneAndUpdate({ user: userRequester, item: itemCommented, text: req.body.text }, { $set: { user: userRequester, item: itemCommented, text: req.body.text } }, { upsert: true, new: true });
    const updateItemComment = yield item_1.default.findOneAndUpdate({ _id: req.params.itemId }, {
        $inc: { commentCounter: 1 },
        $push: { commentUsers: createCommentDocument._id },
    }).exec((err, updatedItem) => {
        if (err) {
            return next(err);
        }
        return res.send(updatedItem);
    });
});
