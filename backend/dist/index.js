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
const express = require("express");
const router = express.Router();
const cors = require("cors");
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt = require("bcrypt");
// import Routes
const unprotectedRoutes = require("./Routes/unprotectedRoutes.ts");
const protectedRoutes = require("./Routes/protectedRoutes.ts");
const session = require("express-session");
const passport = require("passport");
// imports for JSON web token
const jwt = require("jsonwebtoken");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const user_1 = __importDefault(require("./Models/user"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const LocalStrategy = require("passport-local").Strategy;
const app = express();
// Initialize Passport.js and express session
app.use(session({ secret: `${process.env.SESSION_SECRET}`, resave: false, saveUninitialized: true }));
// This is route used when logging in
passport.use(new LocalStrategy((username, password, done) => {
    user_1.default.findOne({ username: username }, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: "Incorrect username" });
        }
        yield bcrypt.compare(password, user.password, (err, res) => {
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
    })).populate({
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
}));
// Used to verify JWT token for each request to protected route
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: `${process.env.SESSION_SECRET}`,
}, function (jwtPayload, done) {
    //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    return user_1.default.findById(jwtPayload.id, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    });
}));
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    user_1.default.findById(id, function (err, user) {
        done(err, user);
    });
});
app.use(passport.initialize());
app.use(passport.session());
// Setup Database
const mongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@inventory.75gbkfs.mongodb.net/?retryWrites=true&w=majority`;
mongoose_1.default.connect(mongoDB);
const db = mongoose_1.default.connection;
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
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const collection_1 = __importDefault(require("./Models/collection"));
const item_1 = __importDefault(require("./Models/item"));
const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'user-avatars',
        format: (req, file) => __awaiter(void 0, void 0, void 0, function* () { return 'png'; }),
        public_id: (req, file) => `${(0, uuid_1.v4)()}`,
    },
});
const parser = (0, multer_1.default)({ storage: cloudStorage });
app.post('/uploadAvatar', parser.single('image'), function (req, res, next) {
    // ROUTE FOR USER PROFILE PICTURE/AVATAR
    if (req.file && req.body.userId) {
        user_1.default.findByIdAndUpdate(req.body.userId, { $set: { avatarURL: `${req.file.path}` } }, {}, (err, user) => {
            if (err) {
                return next(err);
            }
            if (user === null) {
                return res.send("Error. User not found.");
            }
            return res.send({ msg: "Avatar successfully updated", user: user });
        });
        // ROUTE FOR POSTING A GROUP/COLLECTION IMAGE
    }
    else if (req.file && req.body.collectionId) {
        collection_1.default.findByIdAndUpdate(req.body.collectionId, { $set: { image_url: `${req.file.path}` } }, {}, (err, collection) => {
            if (err) {
                return next(err);
            }
            if (collection === null) {
                return res.send("Error. Collection not found.");
            }
            return res.send({ msg: "Image successfully uploaded", collection: collection });
        });
        // ROUTE FOR POSTING AN ITEM IMAGE
    }
    else if (req.file && req.body.itemId) {
        item_1.default.findByIdAndUpdate(req.body.itemId, { $push: { images_urls: `${req.file.path}` } }, {}, (err, collection) => {
            if (err) {
                return next(err);
            }
            if (collection === null) {
                return res.send("Error. Collection not found.");
            }
            return res.send({ msg: "Item image successfully uploaded", collection: collection });
        });
    }
});
// Cloudinary Config END
app.post("/log-in", (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: 'Something is not right',
                user: user,
            });
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }
            // sign JSON web token with entire user object
            // do not know if this is great practice
            const token = jwt.sign({ id: user._id.toJSON() }, `${process.env.SESSION_SECRET}`, {
                // expires in seven days
                expiresIn: "7d",
            });
            res.send({ user, token });
        });
    })(req, res);
});
app.get('/', (req, res) => {
    res.send('Hello');
});
app.post("/sign-up", (req, res, next) => {
    const user = new user_1.default({
        username: req.body.username,
        password: req.body.password,
        bio: req.body.bio,
    }).save((err) => {
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
