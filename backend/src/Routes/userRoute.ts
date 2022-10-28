import express = require('express');
import { brotliDecompressSync } from 'zlib';
import User from '../Models/user';
import async = require('async');
const { body, validationResult } = require('express-validator');

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

router.post('/', [
    body('username', 'Username required or username is invalid.')
        .trim()
        .isLength( {min : 1})
        .escape(),
    (req: any, res: any, next: any) => {
        const errors = validationResult(req);

        const user = new User({
            username: req.body.username,
            bio: req.body.bio,
        });

        if (!errors.isEmpty()) {
            res.send("ERROR! Input invalid!");
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