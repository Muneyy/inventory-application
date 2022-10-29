import express = require('express');
import Item from '../Models/item';
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.get('/', (req, res, next) => {
    Item.find()
        .populate('group')
        .sort([['name', 'ascending']])
        .exec((err, list_item) => {
            if (err) {
                return next(err);
            }
            res.send(list_item);
        });
});

router.post('/', [
    body('name', 'Name must be specified.')
        .trim()
        .isLength( {min: 1})
        .escape(),
    body('description', 'Description must be specified.')
        .trim()
        .isLength( {min: 1})
        .escape(),
    body('img_url', 'Invalid url for image.')
        .optional({ checkFalsy: true })
        .trim()
        .isLength( {min: 1})
        .escape(),
    body('group', 'Please specify a collection this item belongs to.')
        .trim()
        .isLength( {min: 1})
        .escape(),
    (req: any, res: any, next:any) => {
        const errors = validationResult(req);

        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            img_url: req.body.img_url,
            group: req.body.group,
        });

        if (!errors.isEmpty()) {
            res.send(errors.array());
        }
        item.save((err) => {
            if (err) {
                return next(err);
            }
            res.send("Item successfully saved!");
        });
    },

]);

module.exports = router;