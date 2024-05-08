import express from 'express';
import users from './user.js';
import messageToGm from './messageToGm.js';

const routes = express.Router();

routes.use('/users', users);
routes.use('/messagetogm', messageToGm);

export default routes;