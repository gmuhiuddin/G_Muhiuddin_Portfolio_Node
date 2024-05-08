import express from 'express';
import Users from '../models/Users.js';
import { verifyJwToken } from '../middleWares/verifyToken.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const user = await Users.find();

    res.send({ msg: "Users get successfully", user });
});

router.post('/signup', async (req, res) => {
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

router.put('/login', async (req, res) => {
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

router.put('/logout', verifyJwToken, async (req, res) => {
    try {

        const { tokenToRemove, user } = req;
        
        const tokenIndex = user.tokens.indexOf(tokenToRemove);
        user.tokens.splice(tokenIndex, 1);

        await user.save();

        res.clearCookie('jwtoken', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });
        res.send({ msg: "Users logged out successfully" });
    } catch (err) {
        res.send({ msg: err.message });
    }
});

router.get('/check', verifyJwToken, async (req, res) => {
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

export default router;