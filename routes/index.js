import express from 'express';
import users from './user.js';

const routes = express.Router();

routes.use('/users', users);

export default routes;