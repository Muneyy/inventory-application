import express = require('express');
import User from '../Models/user';

const router = express.Router();

router.get('/', (req, res, next) => {
    res.send('Annyeong I am user');
});

module.exports = router;