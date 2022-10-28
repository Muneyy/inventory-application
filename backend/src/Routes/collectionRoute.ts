import express = require('express');
import Collection from '../Models/collection';

const router = express.Router();

router.get('/', (req, res, next) => {
    res.send('Annyeong I am collectionrouter');
});

module.exports = router;