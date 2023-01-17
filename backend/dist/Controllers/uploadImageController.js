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
const collection_1 = __importDefault(require("../Models/collection"));
const item_1 = __importDefault(require("../Models/item"));
const user_1 = __importDefault(require("../Models/user"));
exports.upload_image = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // ROUTE FOR USER PROFILE PICTURE/AVATAR
    if (req.file && req.body.userId) {
        user_1.default.findByIdAndUpdate(req.body.userId, { $set: { avatarURL: `${req.file.path}` } }, {}, (err, user) => {
            if (err) {
                return next(err);
            }
            if (user === null) {
                return res.send("Error. User not found.");
            }
            return res.send({ msg: "Avatar successfully updated", user: user });
        });
        // ROUTE FOR POSTING A GROUP/COLLECTION IMAGE
    }
    else if (req.file && req.body.collectionId) {
        collection_1.default.findByIdAndUpdate(req.body.collectionId, { $set: { image_url: `${req.file.path}` } }, {}, (err, collection) => {
            if (err) {
                return next(err);
            }
            if (collection === null) {
                return res.send("Error. Collection not found.");
            }
            return res.send({ msg: "Image successfully uploaded", collection: collection });
        });
        // ROUTE FOR POSTING AN ITEM IMAGE
    }
    else if (req.file && req.body.itemId) {
        item_1.default.findByIdAndUpdate(req.body.itemId, { $push: { images_urls: `${req.file.path}` } }, {}, (err, collection) => {
            if (err) {
                return next(err);
            }
            if (collection === null) {
                return res.send("Error. Collection not found.");
            }
            return res.send({ msg: "Item image successfully uploaded", collection: collection });
        });
    }
});
