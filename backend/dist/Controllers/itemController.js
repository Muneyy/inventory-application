"use strict";
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
        res.send(list_item);
    });
};
exports.get_item = (req, res, next) => {
    console.log('please work');
    console.log(req.params.itemId);
    item_1.default.findById(req.params.itemId)
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
        .exec((err, result) => {
        if (err) {
            return next(err);
        }
        if (result == null) {
            const err = new Error('Item not found');
            err.status = 404;
            return next(err);
        }
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
