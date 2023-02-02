import express = require('express');
const router = express.Router();
import cors = require('cors');
import 'dotenv/config';
import mongoose, { Collection } from 'mongoose';
import bcrypt = require('bcrypt');

// import Routes
// eslint-disable-next-line @typescript-eslint/no-var-requires
const unprotectedRoutes = require("./Routes/unprotectedRoutes");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const protectedRoutes = require("./Routes/protectedRoutes");

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
        User.findOne({ handle: username }, async (err: any, user: any) => {
            if (err) { 
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: "Incorrect handle" });
            }
            const passwordMatch = await (bcrypt.compare(password, user.password));
            // await bcrypt.compare(password, user.password, (err, res) => {
            if (passwordMatch) {
                return done(null, user);
            }
            else {
                return done(null, false, { message: "Incorrect password" });
            }
            // return done(null, user);
        // Populate friends of the loggedinUser
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
        else if (!user) {
            return done(null, false);
        } 
        else {
            return done(null, user);
        }
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

// Allow CORS on specific URLs
app.use(cors());
app.use((req, res, next) => {
    const allowedOrigins = [`http://localhost:${process.env.CLIENT_PORT}`, 'https://popit-trading.vercel.app', 'https://popit-trading.netlify.app'];
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    } else {
        res.status(403).send('Forbidden');
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post(
    "/log-in",
    (req, res, next) => {
        passport.authenticate("local", {session: false},
            (err: any, user: any, info: any) => {
                if (err || !user) {
                    // This is what is being returned when wrong handle or password is sent
                    return res.status(400).json({
                        message: 'Incorrect Handle or Password',
                        user : user,
                    });
                }
                req.login(user, {session: false}, (err) => {
                    if (err) {
                        res.send(err);
                    }
                    // sign JSON web token with id of user
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
    res.send('Pop Pop Pop Ooh Ahh');
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

app.listen(process.env.PORT, () => {
    console.log(`Node App listening on port ${process.env.PORT}`);
});
