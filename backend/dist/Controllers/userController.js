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
const bcrypt = require("bcrypt");
// Set saltrounds for hashing and salting using bcrypt
const saltRounds = 10;
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../Models/user"));
const router = express.Router();
exports.users = (req, res, next) => {
    user_1.default.find()
        .select("-password")
        .sort([['name', 'ascending']])
        // Do not need to populate friends of other users
        // .populate('friends')
        .exec((err, list_user) => {
        if (err) {
            return next(err);
        }
        res.send(list_user);
    });
};
exports.users_handles = (req, res, next) => {
    user_1.default.find()
        .select("handle")
        .sort([['name', 'ascending']])
        .exec((err, list_users_handles) => {
        if (err) {
            return next(err);
        }
        res.send(list_users_handles);
    });
};
exports.user = (req, res, next) => {
    async.parallel({
        user(callback) {
            user_1.default.findById(req.params.userId)
                .select("-password")
                .populate({
                path: 'friends',
                model: 'Friend',
                populate: [{
                        path: 'recipient',
                        select: ['username', 'avatarURL', 'handle'],
                        model: 'User',
                    }, {
                        path: 'requester',
                        select: ['username', 'avatarURL', 'handle'],
                        model: 'User',
                    }],
            })
                .exec(callback);
        },
        // user_groups(callback) {
        //     Group
        //         .find({user: req.params.userId})
        //         .exec(callback);
        // },
    }, (err, results) => {
        if (err) {
            return next(err);
        }
        if (results.user == null) {
            // No results.
            const err = new Error('User not found');
            err.status = 404;
            return next(err);
        }
        res.send({
            user: results.user,
            // user_groups: results.user_groups,
        });
    });
};
exports.post_user = [
    (0, express_validator_1.body)('username', 'Username invalid.')
        .trim()
        .isLength({ min: 2, max: 20 })
        .escape(),
    (0, express_validator_1.body)('handle', 'Handle invalid or not unique.')
        .trim()
        .isLength({ min: 6, max: 12 })
        .escape(),
    (0, express_validator_1.body)('password', 'Password invalid.')
        .trim()
        .isLength({ min: 8 })
        .escape(),
    (0, express_validator_1.body)('email', 'Email invalid or already been used.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    (0, express_validator_1.body)('bio', 'Bio must be specfiied.')
        .trim()
        .escape(),
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        const salt = yield bcrypt.genSalt(saltRounds);
        const hashedPassword = yield bcrypt.hash(req.body.password, salt);
        const user = new user_1.default({
            username: req.body.username,
            handle: req.body.handle,
            password: hashedPassword,
            email: req.body.email,
            bio: req.body.bio,
        });
        if (!errors.isEmpty()) {
            res.send(errors.array());
        }
        else {
            user_1.default.findOne({ handle: req.body.handle })
                .exec((err, found_user) => {
                if (err) {
                    return next(err);
                }
                if (found_user) {
                    res.send("Handle already exists, please use another one.");
                }
                else {
                    user.save((err) => {
                        if (err) {
                            return next(err);
                        }
                        res.send("User successfully created!");
                    });
                }
            });
        }
    }),
];
exports.update_user = [
    (0, express_validator_1.body)('username', 'Username invalid.')
        .trim()
        .isLength({ min: 2, max: 20 })
        .escape(),
    (0, express_validator_1.body)('handle', 'Handle invalid or not unique.')
        .trim()
        .isLength({ min: 6, max: 12 })
        .escape(),
    (0, express_validator_1.body)('bio', 'Bio must be specfiied.')
        .trim()
        .escape(),
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        const user = new user_1.default({
            username: req.body.username,
            handle: req.body.handle,
            bio: req.body.bio,
        });
        if (!errors.isEmpty()) {
            res.send(errors.array());
        }
        else {
            user_1.default.findOne({ handle: req.body.handle })
                .exec((err, found_user) => {
                if (err)
                    return next(err);
                // If different user has the same handle, then reject request
                else if (found_user && found_user._id.toString() !== req.params.userId) {
                    res.send("Handle already exists, please use another one.");
                }
                else if (req.params.userId !== req.body.requesterId) {
                    res.status(401).send("Unauthorized User.");
                }
                else {
                    user_1.default.findByIdAndUpdate(req.params.userId, { $set: {
                            username: req.body.username,
                            handle: req.body.handle,
                            bio: req.body.bio,
                        } }, { upsert: false }).exec((err, updatedUser) => {
                        if (err)
                            return next(err);
                        if (!updatedUser)
                            return res.status(404).json({ message: "User does not exist" });
                        else {
                            if (req.body.requesterId === updatedUser._id.toString()) {
                                return res.send({ user: updatedUser });
                            }
                            else {
                                console.log(req.body.requesterId);
                                console.log(updatedUser._id.toString());
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
