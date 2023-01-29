import { Request, Response } from "express";
import Group from '../Models/collection';
import Item from '../Models/item';
import User from '../Models/user';

exports.clear_images = async (req: Request, res: Response, next: any) => {
    Item.findById(req.params.itemId)
        .exec((err, item) => {
            if (item) {
                console.log(req.body.requesterId === item.user.toString());
            }
            if (err) return next(err);
            if (item === null) return res.send('Item not found.');
            if (req.body.requesterId !== item.user.toString()) {
                return res.send('Unauthorized User.');
            }
            item.images_urls = [];
            console.log(item.images_urls);
            item.save((err) => {
                if (err) return next(err);
                return res.send({msg: "Images cleared successfully!"});
            });
        });
};

exports.upload_image = async (req: Request, res: Response, next: any) => {
    // ROUTE FOR USER PROFILE PICTURE/AVATAR
    if (req.file && req.body.userId) {
        User.findByIdAndUpdate(req.body.userId,
            { $set: {avatarURL: `${req.file.path}`}},
            {},
            (err, user) => {
                if (err) {
                    return next(err);
                }
                if (user === null) {
                    return res.send("Error. User not found.");
                }
                return res.send({msg: "Avatar successfully updated", user: user});
            });
    // ROUTE FOR POSTING A GROUP/COLLECTION IMAGE
    } else if (req.file && req.body.collectionId) {
        Group.findByIdAndUpdate(req.body.collectionId,
            { $set: {image_url: `${req.file.path}`}},
            {},
            (err, collection) => {
                if (err) {
                    return next(err);
                }
                if (collection === null) {
                    return res.send("Error. Collection not found.");
                }
                return res.send({msg: "Image successfully uploaded", collection: collection});
            });
    // ROUTE FOR POSTING AN ITEM IMAGE
    } else if (req.file && req.body.itemId) {
        Item.findByIdAndUpdate(req.body.itemId,
            { $push: {images_urls: `${req.file.path}`}},
            {},
            (err, item) => {
                if (err) {
                    return next(err);
                }
                if (item === null) {
                    return res.send("Error. Item not found.");
                }
                return res.send({msg: "Item image successfully uploaded", item: item});
            });

    }
};