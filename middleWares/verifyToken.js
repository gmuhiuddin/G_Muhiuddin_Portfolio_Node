import jwt from 'jsonwebtoken';
import Users from '../models/Users.js';
import dotenv from 'dotenv';

dotenv.config();

const verifyJwToken = async (req, res, next) => {

    const token = req.cookies?.jwtoken;

    const jwtSecrert = process.env.jwt_Secret;

    const decoded = jwt.decode(token, jwtSecrert);

    if (!decoded) return res.status(400).send({ msg: "Invalid token!" });

    const { uid } = decoded;

    const user = await Users.findOne({
        _id: uid,
    });

    if (!user) return res.status(400).send({ msg: "Invalid token!" });

    req.user = user;
    req.tokenToRemove = token;

    next();

};

const verifyApiAuth = (req, res, next) => {
    const token = req.headers?.authentication.slice(7);
    
    if (!isAuthentic) return res.send({ msg: "Invalid api auth" });

    const apiAuths = process.env.api_auths.split(' ');
    
    const isAuthentic = apiAuths.includes(token);
    
    if (!isAuthentic) return res.send({ msg: "Invalid api auth" });

    next();
};

export { verifyApiAuth, verifyJwToken };