import express = require('express');
import cors = require('cors');
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt = require('bcrypt');

// import Routes
import itemRouter = require('./Routes/itemRoute');
import userRouter = require('./Routes/userRoute');
import collectionRouter = require('./Routes/collectionRoute');
import friendRouter = require('./Routes/friendRoute')

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
                select: ['username', 'avatarURL'],
                model: 'User',
            }, {
                path: 'requester',
                select: ['username', 'avatarURL'],
                model: 'User',
            }],
        });
    }),
);


passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : `${process.env.SESSION_SECRET}`,
},
function (jwtPayload, done) {
    //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    console.log(jwtPayload);
    return User.findById(jwtPayload, (err: Error, user: any) => {
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
import { randomUUID } from 'crypto';
import { uuid } from 'uuidv4';
import { nextTick } from 'process';
const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'user-avatars',
        format: async (req: any, file: any) => 'png', // supports promises as well
        public_id: (req: any, file: any) => `${uuid()}`,
    },
});
   
const parser = multer({ storage: cloudStorage });
   
app.post('/uploadAvatar', parser.single('image'), function (req: any, res, next) {
    if (req.file) {
        console.log(req.body.userID);
        User.findByIdAndUpdate(req.body.userID,
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
    }
});
// Cloudinary Config END

// Setup Routes
app.use("/users", (userRouter as any));
app.use("/collections", (collectionRouter as any));
app.use("/items", passport.authenticate('jwt', { session: false }), (itemRouter as any));
app.use("/friends", (friendRouter as any));


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
                    const token = jwt.sign(user._id.toJSON(), `${process.env.SESSION_SECRET}`);
                    res.send({user, token});
                });
            })(req, res);
    },
);

app.get("/log-out", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Node App listening on port ${process.env.PORT}`);
});
