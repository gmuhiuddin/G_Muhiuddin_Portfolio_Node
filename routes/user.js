import express from 'express';
import Users from '../models/Users.js';
import { verifyJwToken } from '../middleWares/verifyToken.js';

const routes = express.Router();

routes.get('/', async (req, res) => {
    const user = await Users.find();

    res.send({ msg: "Users get successfully", user });
});

routes.post('/signup', async (req, res) => {
    try {
        const user = new Users({
            ...req.body
        });

        const token = user.generateToken();

        user.tokens.push(token);

        await user.save();

        res.cookie('jwtoken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });
        res.send({ msg: "Users added successfully", user: {
            username: user.username,
            email: user.email,
            uid: user._id
        } });
    } catch (err) {
        res.send({ msg: err.message });
    };
});

routes.put('/login', async (req, res) => {
    try {

        const { body: { email, password } } = req;

        const user = await Users.findOne({
            email
        });

        if (!user) return res.send({ msg: "Email not found!" });

        const passwordIsCorrect = user.comparePassword(password);

        if (!passwordIsCorrect) return res.send({ msg: "Incorrect Password!" });

        const token = user.generateToken();

        user.tokens.push(token);

        await user.save();

        res.cookie('jwtoken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });
        res.send({ msg: "Users logged successfully", user: {
            username: user.username,
            email: user.email,
            uid: user._id
        } });
    } catch (err) {
        res.send({ msg: err.message });
    };
});

routes.put('/logout', verifyJwToken, async (req, res) => {
    try {

        const { tokenToRemove, user } = req;
        
        const tokenIndex = user.tokens.indexOf(tokenToRemove);
        user.tokens.splice(tokenIndex, 1);

        await user.save();

        res.clearCookie('jwtoken');
        res.send({ msg: "Users logged out successfully" });
    } catch (err) {
        res.send({ msg: err.message });
    }
});

routes.get('/check', verifyJwToken, async (req, res) => {
    try {
        const { user } = req;

        res.send({ msg: "Users find successfully", user: {
            username: user.username,
            email: user.email,
            uid: user._id
        } });
    } catch (err) {
        res.send({ msg: err.message });
    }
});

export default routes;