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
// eslint-disable-next-line @typescript-eslint/no-var-requires
const unprotectedRoutes = require("./Routes/unprotectedRoutes");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const protectedRoutes = require("./Routes/protectedRoutes");
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
    user_1.default.findOne({ handle: username }, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: "Incorrect handle" });
        }
        const passwordMatch = yield (bcrypt.compare(password, user.password));
        // await bcrypt.compare(password, user.password, (err, res) => {
        if (passwordMatch) {
            return done(null, user);
        }
        else {
            return done(null, false, { message: "Incorrect password" });
        }
        // return done(null, user);
        // Populate friends of the loggedinUser
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
        else if (!user) {
            return done(null, false);
        }
        else {
            return done(null, user);
        }
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
app.post("/log-in", (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err || !user) {
            // This is what is being returned when wrong handle or password is sent
            return res.status(400).json({
                message: 'Incorrect Handle or Password',
                user: user,
            });
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }
            // sign JSON web token with id of user
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
    res.send('Pop Pop Pop Ooh Ahh');
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
