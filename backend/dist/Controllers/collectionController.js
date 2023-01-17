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
const async = require("async");
const collection_1 = __importDefault(require("../Models/collection"));
const item_1 = __importDefault(require("../Models/item"));
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../Models/user"));
const router = express.Router();
exports.collections = (req, res, next) => {
    collection_1.default.find()
        .sort([['createdAt', 'descending']])
        .populate({
        path: 'user',
        model: user_1.default,
        select: ['username', 'handle', 'avatarURL'],
    })
        .sort([['name', 'ascending']])
        .exec((err, list_group) => {
        if (err) {
            return next(err);
        }
        res.send(list_group);
    });
};
exports.user_collections = (req, res, next) => {
    collection_1.default.find({
        user: req.params.userId,
    })
        .sort([['createdAt', 'descending']])
        .populate({
        path: 'user',
        model: user_1.default,
        select: ['username', 'handle', 'avatarURL'],
    })
        .exec((err, list_group) => {
        if (err) {
            return next(err);
        }
        res.send(list_group);
    });
};
exports.collection = (req, res, next) => {
    async.parallel({
        group(callback) {
            collection_1.default
                .findById(req.params.groupId)
                .populate({
                path: 'user',
                model: user_1.default,
                select: ['username', 'handle', 'avatarURL'],
            })
                .exec(callback);
        },
        group_items(callback) {
            item_1.default
                .find({ group: req.params.groupId })
                .exec(callback);
        },
    }, (err, results) => {
        if (err) {
            return next(err);
        }
        if (results.group == null) {
            const err = new Error('group not found');
            err.status = 404;
            return next(err);
        }
        res.send({
            group: results.group,
            group_items: results.group_items,
        });
    });
};
const availableTags = [
    "anime",
    "comics",
    "cartoon",
    "series",
    "movie",
    "k-pop",
    "j-pop",
    "p-pop",
    "soloist",
    "boy-group",
    "girl-group",
];
exports.post_collection = [
    (0, express_validator_1.body)('name', 'Name must be specified.')
        .trim()
        .isLength({ min: 1, max: 20 })
        .escape(),
    (0, express_validator_1.body)('summary', 'Summary must be specified.')
        .trim()
        .isLength({ min: 1, max: 200 })
        .escape(),
    (0, express_validator_1.body)('tags', 'Tags must not be empty and valid.')
        .isArray()
        .notEmpty()
        // This validation returns a CastError: Cast to ObjectId failed for 
        // value "undefined" (type string) at path "_id" for model "Group"
        .isIn(availableTags),
    (0, express_validator_1.body)('image_url', 'Invalid URL for image.')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 1 })
        .escape(),
    (0, express_validator_1.body)('user', 'User must be specified.')
        .trim()
        .isLength({ min: 1 })
        .isMongoId()
        .escape(),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        console.log("This one");
        console.log(req.body);
        const group = new collection_1.default({
            name: req.body.name,
            summary: req.body.summary,
            tags: req.body.tags,
            image_url: req.body.image_url,
            user: req.body.user,
        });
        if (!errors.isEmpty()) {
            res.send(errors.array());
        }
        else {
            group.save((err) => {
                if (err) {
                    return next(err);
                }
                res.send(group);
            });
        }
    },
];
exports.update_collection = [
    (0, express_validator_1.body)('name', 'Name must be specified.')
        .trim()
        .isLength({ min: 1, max: 20 })
        .escape(),
    (0, express_validator_1.body)('summary', 'Summary must be specified.')
        .trim()
        .isLength({ min: 1, max: 200 })
        .escape(),
    (0, express_validator_1.body)('tags', 'Tags must not be empty and valid.')
        .isArray()
        .notEmpty()
        // This validation returns a CastError: Cast to ObjectId failed for 
        // value "undefined" (type string) at path "_id" for model "Group"
        .isIn(availableTags),
    (0, express_validator_1.body)('image_url', 'Invalid URL for image.')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 1 })
        .escape(),
    (0, express_validator_1.body)('requesterId', 'User must be specified.')
        .trim()
        .isLength({ min: 1 })
        .isMongoId()
        .escape(),
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        console.log(req.body);
        if (!errors.isEmpty()) {
            res.send(errors.array());
        }
        else {
            console.log("YOYOYO");
            console.log(req.body.requesterId);
            yield collection_1.default.findByIdAndUpdate(req.params.collectionId)
                .exec((err, found_collection) => {
                console.log(found_collection === null || found_collection === void 0 ? void 0 : found_collection.user.toString());
                console.log("heyhehey");
                if (err)
                    return next(err);
                if (found_collection && found_collection.user.toString() !== req.body.requesterId) {
                    return res.status(401).send("Unauthorized User.");
                }
                else {
                    collection_1.default.findByIdAndUpdate(req.params.collectionId, { $set: {
                            name: req.body.name,
                            summary: req.body.summary,
                            tags: req.body.tags,
                        } }, { upsert: false }).exec((err, updatedCollection) => {
                        if (err) {
                            return next(err);
                        }
                        if (!updatedCollection) {
                            return res.status(404).json({
                                message: "Collection does not exist",
                            });
                        }
                        else {
                            if (req.body.requesterId === updatedCollection.user.toString()) {
                                return res.send(updatedCollection);
                            }
                            else {
                                console.log(req.body.requesterId);
                                console.log(updatedCollection.user.toString());
                                return res.status(401).json({
                                    message: "Unauthorized User",
                                });
                            }
                        }
                    });
                }
            });
        }
    }),
];
