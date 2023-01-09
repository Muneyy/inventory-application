import express = require('express');
import Item from '../Models/item';
import async = require('async');
import { Request, Response } from "express";
import User from '../Models/user';
import { body, validationResult } from 'express-validator';
import Like from '../Models/like';

const router = express.Router();

exports.item_likes = (req: Request, res: Response, next: any) => {
    Like.find( {item: req.params.itemId} )
        .populate({
            path: 'user',
            model: User,
            select: ['username', 'handle', 'avatarURL'],
        })
        .sort([['createdAt', 'descending']])
        .exec((err, list_likes) => {
            if (err) {
                return next(err);
            }
            res.send(list_likes);
        });

};

exports.like_an_item = async (req: Request, res: Response, next: any) => {
    const userRequester = req.body.liker;
    const itemLiked = req.params.itemId;

    console.log(req.body.liker);
    console.log(req.params.itemId);

    const createLikeDocument = await Like.findOneAndUpdate(
        { user: userRequester, item: itemLiked },
        { $set: { user: userRequester, item: itemLiked }},
        { upsert: true, new: true},
    );

    console.log(createLikeDocument);
    console.log("Does this execute?");
    const updateItem = await Item.findOneAndUpdate(
        { _id: req.params.itemId },
        { 
            $inc: { likeCounter: 1 },
            $push: { likeUsers: createLikeDocument._id },
        },
    ).exec((err, updatedItem) => {
        if (err) {
            return next(err);
        }
        return res.send(updatedItem);
    });

};

exports.unlike_an_item = async (req: Request, res: Response, next: any) => {
    const userRequester = req.body.liker;
    const itemLiked = req.params.itemId;

    console.log(req.body.liker);
    console.log(req.params.itemId);

    const deleteLikeDocument = await Like.findOneAndDelete(
        { user: userRequester, item: itemLiked },
    );

    if (!deleteLikeDocument) {
        return res.status(404).send({ error: "Like document not found" });
    }

    const updateItem = await Item.findOneAndUpdate(
        { _id: req.params.itemId },
        { 
            $inc: { likeCounter: -1 },
            $pull: { likeUsers: deleteLikeDocument._id },
        },
    ).exec((err, updatedItem) => {
        if (err) {
            return next(err);
        }
        return res.send(updatedItem);
    });

};