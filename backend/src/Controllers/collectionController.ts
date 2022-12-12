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
        .populate({
            path: 'user',
            model: User,
            select: ['username'],
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

exports.post_collection = [
    body('name', 'Name must be specified.')
        .trim()
        .isLength( {min: 1, max: 20})
        .escape(),
    body('summary', 'Summary must be specified.')
        .trim()
        .isLength( {min: 1, max: 50})
        .escape(),
    body('tags', 'Summary must be specified.')
        .trim()
        .isArray()
        .isIn([
            "k-pop",
            "j-pop",
            "p-pop",
            "soloist",
            "boy group",
            "girl group",
        ])
        .escape(),
    body('img_url', 'Invalid URL for image.')
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

        const group = new Group({
            name: req.body.name,
            summary: req.body.summary,
            tags: req.body.tags,
            img_url: req.body.img_url,
            user: req.body.user,
        });

        if (!errors.isEmpty()) {
            res.send(errors.array());
        }

        group.save((err) => {
            if (err) {
                return next(err);
            }
            res.send("Group successfully saved!");
        });
    },
];