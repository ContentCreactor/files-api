import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import { GetFiles, Login, Register } from './storage';
import { DATABASE_URI, MONGODB_DATABASE, MONGODB_PASSWORD } from './constants';
import mongoose from 'mongoose';

const app = express();
const port = 8080; // default port to listen

// Apply middlware for CORS and JSON endpoing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const DB = DATABASE_URI.replace(
    '<password>',
    MONGODB_PASSWORD || ''
).replace(
    '<database>',
    MONGODB_DATABASE || ''
);

mongoose.connect(DB)


app.get('/', GetFiles);
app.post('/login', Login);
app.post('/register', Register);


app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});