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
// eslint-disable-next-line @typescript-eslint/no-var-requires
const comment_controller = require('../Controllers/commentController');

router.get('/collections/', collection_controller.collections);

router.get('/collections/:groupId', collection_controller.collection);

router.get('/collections/:groupId/items', item_controller.items);

router.get('/items/:itemId', item_controller.get_item);

router.get('/users/', user_controller.users);

router.get('/users/handles', user_controller.users_handles);

router.get('/users/:userId', user_controller.user);

// Get user's created collections
router.get('/:userId/collections', collection_controller.user_collections);

router.get('/items/:itemId/likes', like_controller.item_likes);

router.post('/users/post', user_controller.post_user);

module.exports = router;
