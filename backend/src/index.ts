import express = require('express');
const router = express.Router();
import cors = require('cors');
import 'dotenv/config';
import mongoose, { Collection } from 'mongoose';
import bcrypt = require('bcrypt');

// import Routes
const unprotectedRoutes = require("./Routes/unprotectedRoutes.ts");
const protectedRoutes = require("./Routes/protectedRoutes.ts");

import session = require("express-session");
import passport = require("passport");

// imports for JSON web token
import jwt = require('jsonwebtoken');
import passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
import User from './Models/user';
import { doesNotMatch } from 'assert';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const LocalStrategy = require("passport-local").Strategy;

const app = express();

// Initialize Passport.js and express session
app.use(session({ secret: `${process.env.SESSION_SECRET}`, resave: false, saveUninitialized: true }));

// This is route used when logging in
passport.use(
    new LocalStrategy((username: string, password: string, done: any) => {
        User.findOne({ username: username }, async (err: any, user: any) => {
            if (err) { 
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            await bcrypt.compare(password, user.password, (err, res) => {
                if (err) {
                    // passwords do not match!
                    return done(null, false, { message: "Incorrect password" });
                } 
                // else {
                //     // passwords match! log user in
                //     return done(null, user);
                // }
            });
            return done(null, user);
        }).populate({
            path: 'friends',
            model: 'Friend',
            populate: [{
                path: 'recipient',
                select: ['username', 'avatarURL', 'handle'],
                model: 'User',
            }, {
                path: 'requester',
                select: ['username', 'avatarURL', 'handle'],
                model: 'User',
            }],
        });
    }),
);

// Used to verify JWT token for each request to protected route
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : `${process.env.SESSION_SECRET}`,
},
function (jwtPayload, done) {
    //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    return User.findById(jwtPayload.id, (err: Error, user: any) => {
        if (err) {
            return done(err, false);
        }
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    });
},
));

passport.serializeUser(function(user: any, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err: any, user: any) {
        done(err, user);
    });
});

app.use(passport.initialize());
app.use(passport.session());

// Setup Database
const mongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@inventory.75gbkfs.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Allow CORS and parse JSON
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Config for Cloudinary
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
    cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`, 
    api_key: `${process.env.CLOUDINARY_API_KEY}`, 
    api_secret: `${process.env.CLOUDINARY_API_SECRET}`, 
});


// eslint-disable-next-line @typescript-eslint/no-var-requires
const { CloudinaryStorage } = require('multer-storage-cloudinary');
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { nextTick } from 'process';
import Group from './Models/collection';
import Item from './Models/item';
const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'user-avatars',
        format: async (req: any, file: any) => 'png', // supports promises as well
        public_id: (req: any, file: any) => `${uuidv4()}`,
    },
});
   
const parser = multer({ storage: cloudStorage });
   
app.post('/uploadAvatar', parser.single('image'), function (req, res, next) {
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
            (err, collection) => {
                if (err) {
                    return next(err);
                }
                if (collection === null) {
                    return res.send("Error. Collection not found.");
                }
                return res.send({msg: "Item image successfully uploaded", collection: collection});
            });

    }
});
// Cloudinary Config END

app.post(
    "/log-in",
    (req, res, next) => {
        passport.authenticate("local", {session: false},
            (err: any, user: any, info: any) => {
                if (err || !user) {
                    return res.status(400).json({
                        message: 'Something is not right',
                        user : user,
                    });
                }
                req.login(user, {session: false}, (err) => {
                    if (err) {
                        res.send(err);
                    }
                    // sign JSON web token with entire user object
                    // do not know if this is great practice
                    const token = jwt.sign({id: user._id.toJSON()}, `${process.env.SESSION_SECRET}`, {
                        // expires in seven days
                        expiresIn: "7d",
                    });
                    res.send({user, token});
                });
            })(req, res);
    },
);

app.get('/', (req, res) => {
    res.send('Hello');
});

app.post("/sign-up", (req, res, next) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        bio: req.body.bio,
    }).save((err: any) => {
        if (err) { 
            return next(err);
        }
        res.send("Success!");
    });
});


app.get("/log-out", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});
// Setup Routes
app.use("/", unprotectedRoutes);
app.use("/", passport.authenticate('jwt', { session: false }), protectedRoutes);


// Why does this protect other routes below it????
app.listen(process.env.PORT, () => {
    console.log(`Node App listening on port ${process.env.PORT}`);
});
