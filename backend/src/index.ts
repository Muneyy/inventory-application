import express = require('express');
import cors = require('cors');
import 'dotenv/config';
import mongoose from 'mongoose';

// import Routes
import itemRouter = require('./Routes/itemRoute');
import userRouter = require('./Routes/userRoute');
import collectionRouter = require('./Routes/collectionRoute');

import session = require("express-session");
import passport = require("passport");
import User from './Models/user';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const LocalStrategy = require("passport-local").Strategy;

const app = express();

// Initialize Passport.js and express session
app.use(session({ secret: `${process.env.SESSION_SECRET}`, resave: false, saveUninitialized: true }));

passport.use(
    new LocalStrategy((username: string, password: string, done: any) => {
        User.findOne({ username: username }, (err: any, user: any) => {
            if (err) { 
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            if (user.password !== password) {
                return done(null, false, { message: "Incorrect password" });
            }
            return done(null, user);
        });
    }),
);

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

// Setup Routes
app.use("/users", (userRouter as any));
app.use("/collections", (collectionRouter as any));
app.use("/items", (itemRouter as any));

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
    passport.authenticate("local"),
    (req, res) => {
        res.send(req.user);
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