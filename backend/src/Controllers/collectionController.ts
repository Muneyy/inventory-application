import express = require('express');
import { Request, Response } from "express";
import async = require('async');
import Group from '../Models/collection';
import Item from '../Models/item';
import { body, validationResult } from 'express-validator';
import User from '../Models/user';

const router = express.Router();

exports.collections = (req: Request, res: Response, next: any) => {
    Group.find()
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
                    .find({ group: req.params.groupId})
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
    body('tags', 'Tags must not be empty.')
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