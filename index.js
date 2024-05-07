import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import db from './config/db.js';
import routes from './routes/index.js';
import { verifyApiAuth } from './middleWares/verifyToken.js';

const app = express();

dotenv.config();

db.connection.once('open', () => {
    console.log("Db connected successfully");
})
.on('error', (err) => {
    console.log("Error: ", err);
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log("Server started successfully");
});

app.use('/:authstoken',verifyApiAuth, routes);