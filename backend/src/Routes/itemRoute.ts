import express = require('express');
import Item from '../Models/item';

const router = express.Router();

router.get('/', (req, res, next) => {
    Item.find()
        .sort([['name', 'ascending']])
        .exec((err, list_item) => {
            if (err) {
                return next(err);
            }
            res.send(list_item);
        });
});

module.exports = router;