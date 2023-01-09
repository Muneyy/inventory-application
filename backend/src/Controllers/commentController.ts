import express = require('express');
import Item from '../Models/item';
import async = require('async');
import { Request, Response } from "express";
import User from '../Models/user';
import { body, validationResult } from 'express-validator';
import Like from '../Models/like';
import Comment from '../Models/comment';

exports.item_comments = (req: Request, res: Response, next: any) => {
    Comment.find( {item: req.params.itemId} )
        .populate({
            path: 'user',
            model: User,
            select: ['username', 'handle', 'avatarURL'],
        })
        .sort([['createdAt', 'descending']])
        .exec((err, list_comments) => {
            if (err) {
                return next(err);
            }
            res.send(list_comments);
        });
};

exports.add_comment = async (req: Request, res: Response, next: any) => {
    const userRequester = req.body.commenter;
    const itemCommented = req.params.itemId;

    const createCommentDocument = await Comment.findOneAndUpdate(
        {user: userRequester, item: itemCommented, text: req.body.text},
        { $set: {user: userRequester, item: itemCommented, text: req.body.text}},
        { upsert: true, new: true},
    );

    const updateItemComment = await Item.findOneAndUpdate(
        {_id: req.params.itemId},
        {
            $inc: { commentCounter: 1 },
            $push: { commentUsers: createCommentDocument._id},
        },
    ).exec((err, updatedItem) => {
        if (err) {
            return next(err);
        }
        return res.send(updatedItem);
    });
};
