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
const user_1 = __importDefault(require("../Models/user"));
const friend_1 = __importDefault(require("../Models/friend"));
const router = express.Router();
exports.send_friend_request = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userRequester = req.body.requester;
    const userRecipient = req.body.recipient;
    // check if user has already been sent a friend request
    const checkerDocument = yield friend_1.default.findOne({
        requester: userRequester,
        recipient: userRecipient,
    }).exec((err, duplicate) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return next(err);
            // If Friend document already exists, don't execute code to add friend
        }
        else if (duplicate != null || duplicate != undefined) {
            return res.send("Error! You've already added this user!");
            // If recipient has not been added yet be requester,
            // then execute this code to add appropriate objects
        }
        else {
            // Create new friend documents for each of the users
            // Push "friend" into each other users' friends array
            const docA = yield friend_1.default.findOneAndUpdate({ requester: userRequester, recipient: userRecipient }, { $set: { status: 1 } }, { upsert: true, new: true });
            const docB = yield friend_1.default.findOneAndUpdate({ recipient: userRequester, requester: userRecipient }, { $set: { status: 2 } }, { upsert: true, new: true });
            const updateUserRequester = yield user_1.default.findOneAndUpdate({ _id: userRequester }, { $push: { friends: docA._id } });
            const updateUserRecipient = yield user_1.default.findOneAndUpdate({ _id: userRecipient }, { $push: { friends: docB._id } }).exec((err, success) => {
                if (err) {
                    return next(err);
                }
                return res.send("Friend Request successfully sent!");
            });
        }
    }));
});
exports.accept_friend_request = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userRequester = req.body.requester;
    const userRecipient = req.body.recipient;
    const docA = yield friend_1.default.findOneAndUpdate({ requester: userRequester, recipient: userRecipient }, { $set: { status: 3 } });
    const docB = yield friend_1.default.findOneAndUpdate({ recipient: userRequester, requester: userRecipient }, { $set: { status: 3 } });
    res.send("You have accepted their friend request!");
});
exports.reject_friend_request = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userRequester = req.body.requester;
    const userRecipient = req.body.recipient;
    const docA = yield friend_1.default.findOneAndRemove({ requester: userRequester, recipient: userRecipient });
    const docB = yield friend_1.default.findOneAndRemove({ recipient: userRequester, requester: userRecipient });
    if (docA != null) {
        const updateUserRequester = yield user_1.default.findOneAndUpdate({ _id: userRequester }, { $pull: { friends: docA._id } });
    }
    if (docB != null) {
        const updateUserRecipient = yield user_1.default.findOneAndUpdate({ _id: userRecipient }, { $pull: { friends: docB._id } });
    }
    res.send("You have deleted their friend request!");
});
