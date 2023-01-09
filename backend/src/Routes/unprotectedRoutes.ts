import express from 'express';
const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const collection_controller = require('../Controllers/collectionController');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const item_controller = require('../Controllers/itemController');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const user_controller = require('../Controllers/userController');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const like_controller = require('../Controllers/likeController');

router.get('/collections/', collection_controller.collections);

router.get('/collections/:groupId', collection_controller.collection);

router.get('/collections/:groupId/items', item_controller.items);

router.get('/users/', user_controller.users);

router.get('/users/handles', user_controller.users_handles);

router.get('/users/:userId', user_controller.user);

// Get user's created collections
router.get('/:userId/collections', collection_controller.user_collections);

router.post('/users/post', user_controller.post_user);

router.post('/items/:itemId/like', like_controller.like_an_item);

router.post('/items/:itemId/unlike', like_controller.unlike_an_item);


module.exports = router;
