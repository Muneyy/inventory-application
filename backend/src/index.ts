import express = require('express');
import cors = require('cors');
import 'dotenv/config';
import mongoose from 'mongoose';

import itemRouter = require('./Routes/itemRoute');
import userRouter = require('./Routes/userRoute');
import collectionRouter = require('./Routes/collectionRoute');

const app = express();

const mongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@inventory.75gbkfs.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(mongoDB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", (userRouter as any));
app.use("/collections", (collectionRouter as any));
app.use("/items", (itemRouter as any));

app.get('/', (req, res) => {
    res.send('Hello');
});

app.listen(process.env.PORT, () => {
    console.log(`Node App listening on port ${process.env.PORT}`);
});