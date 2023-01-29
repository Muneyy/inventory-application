"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // eslint-disable-next-line @typescript-eslint/no-var-requires
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const router = express_1.default.Router();
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
router.post('/collections/:groupId/delete', collection_controller.delete_collection);
router.post('/items/post', item_controller.post_item);
router.put('/items/:itemId/update', item_controller.update_item);
router.put('/items/:itemId/delete', item_controller.delete_item);
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
        format: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
            if (file.originalname.endsWith('.gif')) {
                return 'gif';
            }
            return 'png';
        }),
        public_id: (req, file) => `${(0, uuid_1.v4)()}`,
    },
});
const parser = (0, multer_1.default)({ storage: cloudStorage });
router.post('/uploadAvatar', parser.single('image'), upload_image_controller.upload_image);
// Cloudinary Config END
module.exports = router;
