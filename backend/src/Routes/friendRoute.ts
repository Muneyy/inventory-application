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

    // check if user has already been sent a friend request
    const checkerDocument = await Friend.findOne(
        {
            requester: userRequester,
            recipient: userRecipient,
        },
    ).exec(async (err, duplicate) => {
        if (err) {
            return next(err);
        // If Friend document already exists, don't execute code to add friend
        } else if (duplicate != null || duplicate != undefined) {
            return res.send("Error! You've already added this user!");

        // If recipient has not been added yet be requester,
        // then execute this code to add appropriate objects
        } else {
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
            ).exec((err, success) => {
                if (err) {
                    return next(err);
                }
                return res.send("Friend Request successfully sent!");
            });
        }
        
    });

    

});

router.post('/acceptFriendRequest', async (req,res,next) => {
    const userRequester = req.body.requester;
    const userRecipient = req.body.recipient;

    const docA = await Friend.findOneAndUpdate(
        { requester: userRequester, recipient: userRecipient },
        { $set: { status: 3 }},
    );
    const docB = await Friend.findOneAndUpdate(
        { recipient: userRequester, requester: userRecipient },
        { $set: { status: 3 }},
    );
    res.send("You have accepted their friend request!");

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
    res.send("You have deleted their friend request!");
});

module.exports = router;