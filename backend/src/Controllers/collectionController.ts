import express = require('express');
import { Request, Response } from "express";
import async = require('async');
import Group from '../Models/collection';
import Comment from '../Models/comment';
import Item from '../Models/item';
import { body, validationResult } from 'express-validator';
import User from '../Models/user';
import { existsSync } from 'fs';
import unescapeString from './unescapeString';
import Like from '../Models/like';

const router = express.Router();

exports.collections = (req: Request, res: Response, next: any) => {
    Group.find({ isDeleted: false })
        .sort([['createdAt', 'descending']])
        .populate({
            path: 'user',
            model: User,
            select: ['username', 'handle', 'avatarURL'],
        })
        .sort([['name', 'ascending']])
        .exec((err, list_group) => {
            if (err) {
                return next(err);
            }
            list_group.forEach((group) => {
                group.name = unescapeString(group.name);
                group.summary = unescapeString(group.summary);
            });
            res.send(list_group);
        });
};

exports.user_collections = (req: Request, res: Response, next: any) => {
    Group.find( 
        {
            user: req.params.userId,
            isDeleted: false,
        })
        .sort([['createdAt', 'descending']])
        .populate({
            path: 'user',
            model: User,
            select: ['username', 'handle', 'avatarURL'],
        })
        .exec((err, list_group) => {
            if (err) {
                return next(err);
            }
            list_group.forEach((group) => {
                group.name = unescapeString(group.name);
                group.summary = unescapeString(group.summary);
            });
            res.send(list_group);
        });
};

exports.collection = (req: Request, res: Response, next: any) => {
    async.parallel(
        {
            group(callback) {
                Group
                    .findById(req.params.groupId)
                    .populate({
                        path: 'user',
                        model: User,
                        select: ['username', 'handle', 'avatarURL'],
                    })
                    .exec(callback);
            },
            group_items(callback) {
                Item
                    .find({ group: req.params.groupId, isDeleted: false})
                    .exec(callback);
            },
        },
        (err, results: any) => {
            if (err) {
                return next(err);
            }
            if (results.group == null) {
                const err:any = new Error('group not found');
                err.status = 404;
                return next(err);
            }
            results.group.name = unescapeString(results.group.name);
            results.group.summary = unescapeString(results.group.summary);
            res.send({
                group: results.group,
                group_items: results.group_items,
            });
        },
    );
};

type collectionReq = {
    body: {
        name: string,
        summary: string,
        img_url: string,
        user: string
    }
}

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
    body('name', 'Name must be specified.')
        .trim()
        .isLength({min: 1, max: 20})
        .escape(),
    body('summary', 'Summary must be specified.')
        .trim()
        .isLength({min: 1, max: 200})
        .escape(),
    body('tags', 'Tags must not be empty and valid.')
        .isArray()
        .notEmpty()
        // This validation returns a CastError: Cast to ObjectId failed for 
        // value "undefined" (type string) at path "_id" for model "Group"
        .isIn(availableTags),
    body('image_url', 'Invalid URL for image.')
        .optional({ checkFalsy: true })
        .trim()
        .isLength( {min: 1})
        .escape(),
    body('user', 'User must be specified.')
        .trim()
        .isLength( {min: 1})
        .isMongoId()
        .escape(),
    (req: Request, res: Response, next:any) => {
        const errors = validationResult(req);
        console.log("This one");
        console.log(req.body);
        const group = new Group({
            name: req.body.name,
            summary: req.body.summary,
            tags: req.body.tags,
            image_url: req.body.image_url,
            user: req.body.user,
        });

        if (!errors.isEmpty()) {
            res.send(errors.array());
        } else {
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
    body('name', 'Name must be specified.')
        .trim()
        .isLength({min: 1, max: 20})
        .escape(),
    body('summary', 'Summary must be specified.')
        .trim()
        .isLength({min: 1, max: 200})
        .escape(),
    body('tags', 'Tags must not be empty and valid.')
        .isArray()
        .notEmpty()
        // This validation returns a CastError: Cast to ObjectId failed for 
        // value "undefined" (type string) at path "_id" for model "Group"
        .isIn(availableTags),
    body('image_url', 'Invalid URL for image.')
        .optional({ checkFalsy: true })
        .trim()
        .isLength( {min: 1})
        .escape(),
    body('requesterId', 'User must be specified.')
        .trim()
        .isLength( {min: 1})
        .isMongoId()
        .escape(),
    async (req: Request, res: Response, next:any) => {
        const errors = validationResult(req);
        console.log(req.body);

        if (!errors.isEmpty()) {
            res.send(errors.array());
        }
        else {
            await Group.findById(req.params.collectionId)
                .exec((err, found_collection) => {
                    if (err) return next(err);
                    if (found_collection == null) return res.status(404).send("Collection does not exist.");
                    // Check whether user that is attempting to edit is indeed the collection's owner
                    if (found_collection && found_collection.user.toString() !== req.body.requesterId) {
                        return res.status(401).send("Unauthorized User.");
                    }
                    else {
                        Group.findByIdAndUpdate(
                            req.params.collectionId,
                            { $set: {
                                name: req.body.name,
                                summary: req.body.summary,
                            }, $addToSet: {
                                tags: { $each: req.body.tags },
                            }},
                        ).exec((err, updatedCollection) => {
                            if (err) {
                                return next(err);
                            }
                            if (!updatedCollection) {
                                return res.status(404).json({
                                    message: "Collection does not exist",
                                });
                            } else {
                                if (req.body.requesterId === updatedCollection.user.toString()) {
                                    return res.send(updatedCollection);
                                } else {
                                    return res.status(401).json({
                                        message: "Unauthorized User",
                                    });
                                }
                            }
                        });
                    }
                });
        }

    },
];

// TEST route for deleting collections
exports.delete_collection = async (req: Request, res: Response, next: any) => {
    const requesterId = req.body.requesterId;
    const group_document = await Group.findOne({ _id: req.params.groupId })
        .exec(async (err, group) => {
            if (err) return next(err);
            if (group === null) return res.status(404).send("Group not found.");
            if (group && requesterId !== group.user.toString()) {
                return res.status(401).send("Unauthorized User.");
            }
            else if (group && requesterId === group.user.toString()) {
                try {
                    const item_list = await Item.find({ group: group._id });
                    await Item.findByIdAndUpdate(group._id, {$set: {isDeleted: true}});
                    item_list.forEach(async (item) => {
                        try {
                            // soft delete the comments
                            const comments = await Comment
                                .findByIdAndUpdate(item._id, { $set: { isDeleted: true } });
                            // console.log(comments.count() + ' comments were soft deleted');
                            // soft delete the likes
                            const likes = await Like
                                .findByIdAndUpdate(item._id, { $set: { isDeleted: true } });
                            // console.log(likes.modifiedCount + ' likes were soft deleted');
                        } catch (err) {
                            return next(err as any);
                        }
                    });
                    await Group.findByIdAndUpdate(group._id, { $set: { isDeleted: true } });
                    return res.send({msg: "Collection deleted."});
                } catch (err) {
                    return next(err);
                }
            }
        });
};