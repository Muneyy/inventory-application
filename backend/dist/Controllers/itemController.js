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
const comment_1 = __importDefault(require("../Models/comment"));
const express_validator_1 = require("express-validator");
const collection_1 = __importDefault(require("../Models/collection"));
const unescapeString_1 = __importDefault(require("./unescapeString"));
const router = express.Router();
// Added validation for Soft Delete for comments and likes
exports.items = (req, res, next) => {
    item_1.default.find({ group: req.params.groupId, isDeleted: false })
        .populate('group')
        .populate({
        path: 'user',
        model: user_1.default,
        select: ['username', 'handle', 'avatarURL'],
    })
        .populate({
        path: 'likeUsers',
        match: { isDeleted: false },
        model: like_1.default,
        populate: {
            path: 'user',
            model: user_1.default,
            select: ['username', 'avatarURL', 'handle'],
        },
    })
        .populate({
        path: 'commentUsers',
        match: { isDeleted: false },
        model: comment_1.default,
        populate: {
            path: 'user',
            model: user_1.default,
            select: ['username', 'avatarURL', 'handle'],
        },
    })
        .sort([['createdAt', 'descending']])
        .exec((err, list_item) => {
        if (err) {
            return next(err);
        }
        list_item.forEach((item) => {
            item.name = (0, unescapeString_1.default)(item.name);
            item.description = (0, unescapeString_1.default)(item.description);
        });
        res.send(list_item);
    });
};
exports.get_item = (req, res, next) => {
    item_1.default.findById(req.params.itemId, { isDeleted: false })
        .populate({
        path: 'group',
        model: collection_1.default,
        select: ['name', 'summary'],
    })
        .populate({
        path: 'user',
        model: user_1.default,
        select: ['username', 'handle', 'avatarURL'],
    })
        .populate({
        path: 'likeUsers',
        match: { isDeleted: false },
        model: like_1.default,
        populate: {
            path: 'user',
            model: user_1.default,
            select: ['username', 'avatarURL', 'handle'],
        },
    })
        .populate({
        path: 'commentUsers',
        match: { isDeleted: false },
        model: comment_1.default,
        populate: {
            path: 'user',
            model: user_1.default,
            select: ['username', 'avatarURL', 'handle'],
        },
    })
        .exec((err, result) => {
        if (err) {
            return next(err);
        }
        if (result == null) {
            const err = new Error('Item not found');
            err.status = 404;
            return next(err);
        }
        result.name = (0, unescapeString_1.default)(result.name);
        result.description = (0, unescapeString_1.default)(result.description);
        res.send({
            item: result,
        });
    });
};
const availableTags = [
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
];
exports.post_item = [
    (0, express_validator_1.body)('name', 'Name must be specified.')
        .trim()
        .isLength({ min: 1, max: 20 })
        .escape(),
    (0, express_validator_1.body)('description', 'Description must be specified.')
        .trim()
        .isLength({ min: 1, max: 200 })
        .escape(),
    (0, express_validator_1.body)('tags', 'Tags must not be empty and valid.')
        .isArray()
        .notEmpty()
        // This validation returns a CastError: Cast to ObjectId failed for 
        // value "undefined" (type string) at path "_id" for model "Group"
        .isIn(availableTags),
    (0, express_validator_1.body)('price', "Invalid Price.")
        .isNumeric()
        .isInt({ gt: 0 }),
    (0, express_validator_1.body)('images_urls', 'Invalid url for image.')
        .optional({ checkFalsy: true }),
    (0, express_validator_1.body)('group', 'Please specify a group this item belongs to.')
        .trim()
        .isLength({ min: 1 })
        .isMongoId()
        .escape(),
    (0, express_validator_1.body)('user', 'Please specify a user this item belongs to.')
        .trim()
        .isLength({ min: 1 })
        .isMongoId()
        .escape(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        const item = new item_1.default({
            name: req.body.name,
            description: req.body.description,
            tags: req.body.tags,
            price: req.body.price,
            images_urls: req.body.images_urls,
            group: req.body.group,
            user: req.body.user,
            category: req.body.category,
        });
        if (!errors.isEmpty()) {
            res.send(errors.array());
        }
        else {
            item.save((err) => {
                if (err) {
                    return next(err);
                }
                res.send(item);
            });
        }
    },
];
exports.update_item = [
    (0, express_validator_1.body)('name', 'Name must be specified.')
        .trim()
        .isLength({ min: 1, max: 20 })
        .escape(),
    (0, express_validator_1.body)('description', 'Description must be specified.')
        .trim()
        .isLength({ min: 1, max: 200 })
        .escape(),
    (0, express_validator_1.body)('tags', 'Tags must not be empty and valid.')
        .isArray()
        .notEmpty()
        // This validation returns a CastError: Cast to ObjectId failed for 
        // value "undefined" (type string) at path "_id" for model "Group"
        .isIn(availableTags),
    (0, express_validator_1.body)('price', "Invalid Price.")
        .isNumeric()
        .isInt({ gt: 0 }),
    (0, express_validator_1.body)('images_urls', 'Invalid url for image.')
        .optional({ checkFalsy: true }),
    (0, express_validator_1.body)('requesterId', 'User must be specified.')
        .trim()
        .isLength({ min: 1 })
        .isMongoId()
        .escape(),
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.send(errors.array());
        }
        else {
            yield item_1.default.findById(req.params.itemId)
                .exec((err, found_item) => {
                if (err)
                    return next(err);
                if (found_item == null)
                    return res.status(404).send("Item does not exist.");
                if (found_item && found_item.user.toString() !== req.body.requesterId) {
                    res.status(401).send("Unauthorized User.");
                }
                else {
                    item_1.default.findByIdAndUpdate(req.params.itemId, { $set: {
                            name: req.body.name,
                            description: req.body.description,
                            price: req.body.price,
                            category: req.body.category,
                        }, $addToSet: {
                            tags: { $each: req.body.tags },
                        } }).exec((err, updatedItem) => {
                        if (err)
                            return next(err);
                        if (!updatedItem)
                            return res.status(404).send("Item does not exist.");
                        else {
                            res.send(updatedItem);
                        }
                    });
                }
            });
        }
    }),
];
exports.delete_item = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const requesterId = req.body.requesterId;
    yield item_1.default.findOne({ _id: req.params.itemId })
        .exec((err, item) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return next(err);
        if (item === null)
            return res.status(404).send("Item not found.");
        if (item && requesterId !== item.user.toString()) {
            return res.status(401).send("Unauthorized User.");
        }
        else if (item && requesterId === item.user.toString()) {
            try {
                // soft delete the comments
                const comments = yield comment_1.default
                    .findByIdAndUpdate(item._id, { $set: { isDeleted: true } });
                // console.log(comments.modifiedCount + ' comments were soft deleted');
                // soft delete the likes
                const likes = yield like_1.default
                    .findByIdAndUpdate(item._id, { $set: { isDeleted: true } });
                // console.log(likes.modifiedCount + ' likes were soft deleted');
                yield item_1.default.findByIdAndUpdate(item._id, {
                    $set: { isDeleted: true },
                });
                return res.send({ msg: "Item deleted" });
            }
            catch (err) {
                return next(err);
            }
        }
    }));
});
