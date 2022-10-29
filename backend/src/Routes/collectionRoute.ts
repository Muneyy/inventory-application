import express = require('express');
import async = require('async');
import Collection from '../Models/collection';
import Item from '../Models/item';
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.get('/', (req, res, next) => {
    Collection.find()
        .populate('user')
        .sort([['name', 'ascending']])
        .exec((err, list_collection) => {
            if (err) {
                return next(err);
            }
            res.send(list_collection);
        });
});

router.get('/:collectionId', (req, res, next) => {
   async.parallel(
    {
        collection(callback) {
            Collection
                .findById(req.params.collectionId)
                .exec(callback);
        },
        collection_items(callback) {
            Item
                .find({ collection: req.params.collectionId})
                .exec(callback)
        },
    },
    (err, results) => {
        if (err) => {
            return next(err)
        }
        if (results.collection == null) {
            const err = new Error('Collection not found');
            err.status = 404;
            return next(err);
        }
        res.send({
            collection: results.collection,
            collection_items: results.collection_items,
        })
    }
   )
})

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

        const collection = new Collection({
            name: req.body.name,
            summary: req.body.summary,
            img_url: req.body.img_url,
            group: req.body.group,
        });

        if (!errors.isEmpty()) {
            res.send(errors.array());
        }

        collection.save((err) => {
            if (err) => {
                return next(err)
            }
            res.send("Collection successfully saved!");
        })
    },
]);

module.exports = router;