import express = require('express');
import Item from '../Models/item';
import async = require('async');
import { Request, Response } from "express";
import User from '../Models/user';
import Like from '../Models/like';
import { body, validationResult } from 'express-validator';

const router = express.Router();

exports.items = (req: Request, res: Response, next: any) => {
    Item.find({group: req.params.groupId})
        .populate('group')
        .populate({
            path: 'user',
            model: User,
            select: ['username', 'handle', 'avatarURL'],
        })
        .populate({
            path: 'likeUsers',
            model: Like,
            populate: {
                path: 'user',
                model: User,
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

exports.item = (req: Request, res: Response, next: any) => {
    async.parallel(
        {
            item(callback) {
                Item.findById(req.params.itemId)
                    .exec(callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err);
            }

            if (results.item == null) {
                const err:any = new Error('Item not found');
                err.status = 404;
                return next(err);
            }
            res.send({
                item: results.item,
            });
        },
    );
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
    body('name', 'Name must be specified.')
        .trim()
        .isLength( {min: 1, max: 20})
        .escape(),
    body('description', 'Description must be specified.')
        .trim()
        .isLength( {min: 1, max: 200})
        .escape(),
    body('tags', 'Tags must not be empty and valid.')
        .isArray()
        .notEmpty()
        // This validation returns a CastError: Cast to ObjectId failed for 
        // value "undefined" (type string) at path "_id" for model "Group"
        .isIn(availableTags),
    body('price', "Invalid Price.")
        .isNumeric()
        .isInt({ gt: 0 }),
    body('images_urls', 'Invalid url for image.')
        .optional({ checkFalsy: true }),
    body('group', 'Please specify a group this item belongs to.')
        .trim()
        .isLength( {min: 1})
        .isMongoId()
        .escape(),
    body('user', 'Please specify a user this item belongs to.')
        .trim()
        .isLength( {min: 1})
        .isMongoId()
        .escape(),
    (req: any, res: any, next:any) => {
        const errors = validationResult(req);

        const item = new Item({
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
        } else {

            item.save((err) => {
                if (err) {
                    return next(err);
                }
                res.send(item);
            });
        }
    },

];