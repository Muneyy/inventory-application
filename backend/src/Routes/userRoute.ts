import express = require('express');
import async = require('async');
const { body, validationResult } = require('express-validator');

import User from '../Models/user';
import Collection from '../Models/collection';

const router = express.Router();

router.get('/', (req, res, next) => {
    User.find()
        .sort([['name', 'ascending']])
        .exec((err, list_user) => {
            if (err) {
                return next(err);
            }
            res.send(list_user);
        });
});



router.get('/:userId', (req, res, next) => {
    async.parallel(
        {
            user(callback) {
                User.findById(req.params.userId)
                    .exec(callback);
            },
            user_collections(callback) {
                Collection
                    .find({user: req.params.userId})
                    .exec(callback);
            },
        },
        (err, results) => {
            if (err) { 
                return next(err);
            }
            if (results.user == null) {
                // No results.
                const err = new Error('User not found');
                err.status = 404;
                return next(err);
            }
            res.send(
                {
                    user: results.user, 
                    user_collections: results.user_collections,
                },
            );
        },
    );
});

type UserReq = {
    body: {
        username: string,
        bio: string,
    }
}

router.post('/', [
    body('username', 'Username required or username is invalid.')
        .trim()
        .isLength( {min : 1})
        .escape(),
    body('bio', 'Bio must be specfiied.')
        .trim()
        .isLength( {min : 1})
        .escape(),
    (req: UserReq, res: any, next: any) => {
        const errors = validationResult(req);

        const user = new User({
            username: req.body.username,
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
                            res.send("SUCESS!");
                        });
                    }
                });
        }
    },

]);

module.exports = router;