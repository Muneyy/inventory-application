import { Request, Response } from "express";
import express = require('express');
import async = require('async');
import bcrypt = require('bcrypt');
// Set saltrounds for hashing and salting using bcrypt
const saltRounds = 10;

import { body, validationResult } from 'express-validator';

import User from '../Models/user';
import Group from '../Models/collection';
import Friend from '../Models/friend';

const router = express.Router();

exports.users = (req: Request, res: Response, next: any) => {
    User.find()
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

exports.users_handles = (req: Request, res: Response, next: any) => {
    User.find()
        .select("handle")
        .sort([['name', 'ascending']])
        .exec((err, list_users_handles) => {
            if (err) {
                return next(err);
            }
            res.send(list_users_handles);
        });
};

exports.user = (req: Request, res: Response, next: any) => {
    async.parallel(
        {
            user(callback) {
                User.findById(req.params.userId)
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
        },
        (err, results) => {
            if (err) { 
                return next(err);
            }
            if (results.user == null) {
                // No results.
                const err:any = new Error('User not found');
                err.status = 404;
                return next(err);
            }
            res.send(
                {
                    user: results.user, 
                    // user_groups: results.user_groups,
                },
            );
        },
    );
};

type UserReq = {
    body: {
        username: string,
        handle: string,
        email: string,
        password: string,
        bio: string,
    }
}

exports.post_user = [
    body('username', 'Username invalid.')
        .trim()
        .isLength( {min : 2, max: 20})
        .escape(),
    body('handle', 'Handle invalid or not unique.')
        .trim()
        .isLength( {min : 6, max:12})
        .escape(),
    body('password', 'Password invalid.')
        .trim()
        .isLength( {min : 8})
        .escape(),
    body('email', 'Email invalid or already been used.')
        .trim()
        .isLength( {min : 1})
        .escape(),
    body('bio', 'Bio must be specfiied.')
        .trim()
        .escape(),
    async (req: UserReq, res: any, next: any) => {
        const errors = validationResult(req);

        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            username: req.body.username,
            handle: req.body.handle,
            password: hashedPassword,
            email: req.body.email,
            bio: req.body.bio,
        });

        if (!errors.isEmpty()) {
            res.send(errors.array());
        } else {
            User.findOne( {username: req.body.username})
                .exec((err, found_user) => {
                    if (err) {
                        return next(err);
                    }
                    if (found_user) {
                        res.send("Username already exists, please use another one.");
                    } else {
                        user.save((err) => {
                            if (err) {
                                return next(err);
                            }
                            res.send("User successfully created!");
                        });
                    }
                });
        }
    },

];