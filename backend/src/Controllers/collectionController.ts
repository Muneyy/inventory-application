import express = require('express');
import { Request, Response } from "express";
import async = require('async');
import Group from '../Models/collection';
import Item from '../Models/item';
import { body, validationResult } from 'express-validator';
import User from '../Models/user';
import { existsSync } from 'fs';

const router = express.Router();

exports.collections = (req: Request, res: Response, next: any) => {
    Group.find({$or: [{isDeleted: {$exists: false}}, {isDeleted: false}]})
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
            res.send(list_group);
        });
};

exports.user_collections = (req: Request, res: Response, next: any) => {
    Group.find( 
        {
            user: req.params.userId,
            $or: [{isDeleted: {$exists: false}}, {isDeleted: false}],
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
            res.send(list_group);
        });
};

exports.collection = (req: Request, res: Response, next: any) => {
    async.parallel(
        {
            group(callback) {
                Group
                    .findById(req.params.groupId, {isDeleted: false})
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
        (err, results) => {
            if (err) {
                return next(err);
            }
            if (results.group == null) {
                const err:any = new Error('group not found');
                err.status = 404;
                return next(err);
            }
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
            console.log("YOYOYO");
            console.log(req.body.requesterId);
            await Group.findByIdAndUpdate(req.params.collectionId)
                .exec((err, found_collection) => {
                    console.log(found_collection?.user.toString());
                    console.log("heyhehey");
                    if (err) return next(err);
                    if (found_collection && found_collection.user.toString() !== req.body.requesterId) {
                        return res.status(401).send("Unauthorized User.");
                    }
                    else {
                        Group.findByIdAndUpdate(
                            req.params.collectionId,
                            { $set: {
                                name: req.body.name,
                                summary: req.body.summary,
                                tags: req.body.tags,
                            }},
                            {upsert: false},
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

    },
];

// TEST route for deleting collections
exports.delete_collection = async (req: Request, res: Response, next: any) => {
    const requesterId = req.body.requesterId;
    const group_document = await Group.findOne({ _id: req.params.groupId })
        .exec((err, group) => {
            if (err) return next(err);
            if (group && requesterId === group.user.toString()) {
                // Validate actually calls the cascading soft delete for the item
                // Validate is a placeholder callback in this case such that I just needed
                // something to call on the fetched group to execute the cascading soft delete
                group.validate();
                return res.send('done');
            }
            else if (group && requesterId !== group.user.toString()) {
                return res.status(401).send("Unauthorized User.");
            }
        });
};