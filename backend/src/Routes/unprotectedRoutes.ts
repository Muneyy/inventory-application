import express from 'express';
const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const collection_controller = require('../Controllers/collectionController');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const user_controller = require('../Controllers/userController');

router.get('/collections/', collection_controller.collections);

router.get('/collections/:groupId', collection_controller.collection);

router.get('/users/', user_controller.users);

router.get('/users/handles', user_controller.users_handles);

router.get('/users/:userId', user_controller.user);

module.exports = router;
