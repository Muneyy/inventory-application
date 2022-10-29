import express = require('express');
import async = require('async');
import Group from '../Models/collection';
import Item from '../Models/item';
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.get('/', (req, res, next) => {
    Group.find()
        .populate('user')
        .sort([['name', 'ascending']])
        .exec((err, list_group) => {
            if (err) {
                return next(err);
            }
            res.send(list_group);
        });
});

router.get('/:groupId', (req, res, next) => {
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
});

router.post('/', [
    body('name', 'Name must be specified.')
        .trim()
        .isLength( {min: 1})
        .escape(),
    body('summary', 'Summary must be specified.')
        .trim()
        .isLength( {min: 1})
        .escape(),
    body('img_url', 'Invalid URL for image.')
        .optional({ checkFalsy: true })
        .trim()
        .isLength( {min: 1})
        .escape(),
    body('user', 'User must be specified.')
        .trim()
        .isLength( {min: 1})
        .escape(),
    (req: any, res: any, next:any) => {
        const errors = validationResult(req);

        const group = new Group({
            name: req.body.name,
            summary: req.body.summary,
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
]);

module.exports = router;