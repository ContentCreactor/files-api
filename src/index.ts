import express from 'express';
import cors from 'cors';
import { Auth, GetFiles, Login, Register } from './storage';
import { DATABASE_URI, MONGODB_DATABASE, MONGODB_PASSWORD, MONGODB_USER } from './constants';
import mongoose from 'mongoose';
import expressContext from "express-request-context";
import { authenticator } from './middleware/authentication';
import cookieParser from 'cookie-parser';

const app = express();
const port = 8080; // default port to listen

app.use(cors({
    origin: 'http://example.com',
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Origin', 'Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(expressContext()); // This will enable the 'context' object for you.

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const DB = DATABASE_URI
    .replace(
        '<user>',
        MONGODB_USER
    )
    .replace(
        '<password>',
        MONGODB_PASSWORD
    ).replace(
        '<database>',
        MONGODB_DATABASE
    );

mongoose.connect(DB)

app.get('/', GetFiles);
app.get('/auth', authenticator, Auth);

//app.get('/', GetFiles);
app.post('/login', Login);
app.post('/register', Register);


app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});