import express = require('express');
import async = require('async');
const { body, validationResult } = require('express-validator');

import User from '../Models/user';
import Friend from '../Models/friend';

const router = express.Router();

// router.get('/getSentFriendRequests', async (req: any, res, next) => {
//     const friends = req.params.friends;

//     Friend.find()
// })

router.post('/sendFriendRequest', async (req, res, next) => {
    const userRequester = req.body.requester;
    const userRecipient = req.body.recipient;

    // Create new friend documents for each of the users
    // Push "friend" into each other users' friends array
    const docA = await Friend.findOneAndUpdate(
        { requester: userRequester, recipient: userRecipient },
        { $set: { status: 1 }},
        { upsert: true, new: true },
    );
    const docB = await Friend.findOneAndUpdate(
        { recipient: userRequester, requester: userRecipient },
        { $set: { status: 2 }},
        { upsert: true, new: true },
    );
    const updateUserRequester = await User.findOneAndUpdate(
        { _id: userRequester },
        { $push: { friends: docA._id }},
    );
    const updateUserRecipient = await User.findOneAndUpdate(
        { _id: userRecipient },
        { $push: { friends: docB._id }},
    );

    res.send("Friend Request successfully sent!");

});

router.post('/acceptFriendRequest', async (req,res,next) => {
    const userRequester = req.body.requester;
    const userRecipient = req.body.recipient;

    Friend.findOneAndUpdate(
        { requester: userRequester, recipient: userRecipient },
        { $set: { status: 3 }},
    );
    Friend.findOneAndUpdate(
        { recipient: userRequester, requester: userRecipient },
        { $set: { status: 3 }},
    );
});

router.post('/rejectFriendRequest', async (req, res, next) => {
    const userRequester = req.body.requester;
    const userRecipient = req.body.recipient;

    const docA = await Friend.findOneAndRemove(
        { requester: userRequester, recipient: userRecipient },
    );
    const docB = await Friend.findOneAndRemove(
        { recipient: userRequester, requester: userRecipient },
    );
    if (docA != null) {
        const updateUserRequester = await User.findOneAndUpdate(
            { _id: userRequester },
            { $pull: { friends: docA._id }},
        );
    }
    if (docB != null) {
        const updateUserRecipient = await User.findOneAndUpdate(
            { _id: userRecipient },
            { $pull: { friends: docB._id }},
        );
    }
});

module.exports = router;