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
const express = require("express");
const item_1 = __importDefault(require("../Models/item"));
const user_1 = __importDefault(require("../Models/user"));
const like_1 = __importDefault(require("../Models/like"));
const router = express.Router();
exports.item_likes = (req, res, next) => {
    like_1.default.find({ item: req.params.itemId })
        .populate({
        path: 'user',
        model: user_1.default,
        select: ['username', 'handle', 'avatarURL'],
    })
        .sort([['createdAt', 'descending']])
        .exec((err, list_likes) => {
        if (err) {
            return next(err);
        }
        res.send(list_likes);
    });
};
exports.like_an_item = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userRequester = req.body.liker;
    const itemLiked = req.params.itemId;
    const createLikeDocument = yield like_1.default.findOneAndUpdate({ user: userRequester, item: itemLiked }, { $set: { user: userRequester, item: itemLiked } }, { upsert: true, new: true });
    const updateItemLike = yield item_1.default.findOneAndUpdate({ _id: req.params.itemId }, {
        $inc: { likeCounter: 1 },
        $push: { likeUsers: createLikeDocument._id },
    }).exec((err, updatedItem) => {
        if (err) {
            return next(err);
        }
        return res.send(updatedItem);
    });
});
exports.unlike_an_item = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userRequester = req.body.liker;
    const itemLiked = req.params.itemId;
    console.log(req.body.liker);
    console.log(req.params.itemId);
    const deleteLikeDocument = yield like_1.default.findOneAndDelete({ user: userRequester, item: itemLiked });
    if (!deleteLikeDocument) {
        return res.status(404).send({ error: "Like document not found" });
    }
    const updateItem = yield item_1.default.findOneAndUpdate({ _id: req.params.itemId }, {
        $inc: { likeCounter: -1 },
        // Note that likeUsers pertain to the like document, not the user itself
        $pull: { likeUsers: deleteLikeDocument._id },
    }).exec((err, updatedItem) => {
        if (err) {
            return next(err);
        }
        // updatedItem is actually not updated yet
        return res.send(updatedItem);
    });
});
