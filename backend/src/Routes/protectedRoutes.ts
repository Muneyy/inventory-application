import express from 'express';// eslint-disable-next-line @typescript-eslint/no-var-requires
const { CloudinaryStorage } = require('multer-storage-cloudinary');
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { nextTick } from 'process';
import Group from '../Models/collection';
import Item from '../Models/item';
import User from '../Models/user';
const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const collection_controller = require('../Controllers/collectionController');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const user_controller = require('../Controllers/userController');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const friend_controller = require('../Controllers/friendController');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const item_controller = require('../Controllers/itemController');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const like_controller = require('../Controllers/likeController');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const comment_controller = require('../Controllers/commentController');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const upload_image_controller = require('../Controllers/uploadImageController');

router.put('/users/:userId/update', user_controller.update_user);

router.post('/collections/post', collection_controller.post_collection);

router.put('/collections/:collectionId/update', collection_controller.update_collection);

router.post('/items/post', item_controller.post_item);

router.post('/friends/sendFriendRequest', friend_controller.send_friend_request);

router.post('/friends/acceptFriendRequest', friend_controller.accept_friend_request);

router.post('/friends/rejectFriendRequest', friend_controller.reject_friend_request);

router.post('/items/:itemId/like', like_controller.like_an_item);

router.post('/items/:itemId/unlike', like_controller.unlike_an_item);

router.post('/items/:itemId/comment/add', comment_controller.add_comment);

// Config for Cloudinary
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
    cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`, 
    api_key: `${process.env.CLOUDINARY_API_KEY}`, 
    api_secret: `${process.env.CLOUDINARY_API_SECRET}`, 
});

const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'user-avatars',
        format: async (req: any, file: any) => {
            if (file.originalname.endsWith('.gif')) {
                return 'gif';
            }
            return 'png';
        },
        public_id: (req: any, file: any) => `${uuidv4()}`,
    },
});
   
const parser = multer({ storage: cloudStorage });

router.post('/uploadAvatar', parser.single('image'), upload_image_controller.upload_image);
// Cloudinary Config END

module.exports = router;