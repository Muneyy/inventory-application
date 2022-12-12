import express from 'express';
const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const collection_controller = require('../Controllers/collectionController');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const user_controller = require('../Controllers/userController');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const friend_controller = require('../Controllers/friendController');

router.post('/collections/post', collection_controller.post_collection);

router.post('/friends/sendFriendRequest', friend_controller.send_friend_request);

router.post('/friends/acceptFriendRequest', friend_controller.accept_friend_request);

router.post('/friends/rejectFriendRequest', friend_controller.reject_friend_request);

module.exports = router;