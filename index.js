import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import db from './config/db.js';
import routes from './routes/index.js';
import { verifyApiAuth } from './middleWares/verifyToken.js';

const app = express();

db.connection.once('open', () => {
    console.log("Db connected successfully");
})
.on('error', (err) => {
    console.log("Error: ", err);
})

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.listen(3001, () => {
    console.log("Server started successfully");
});

app.use('/:authstoken',verifyApiAuth, routes);