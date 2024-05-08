import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { Schema, model } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        require: true
    },
    userImg: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        minLength: 8
    },
    tokens: {
        type: Array,
        default: []
    }
});

UserSchema.pre('save', function (next) {

    let user = this;

    if (user.isModified('password')) {
        const salt = bcrypt.genSaltSync(10);

        const hashedPassword = bcrypt.hashSync(user.password, salt);

        user.password = hashedPassword;
    };
    
    next();
});

UserSchema.methods.generateToken = function () {

    const { username, email, _id } = this;

    const jwtSecret = process.env.jwt_Secret;

    const token = jwt.sign({ username, email, uid: _id}, jwtSecret);

    return token;
};

UserSchema.methods.comparePassword = function (password) {

    const { password: hashedPassword } = this;

    const isCorrect = bcrypt.compareSync(password, hashedPassword);

    return isCorrect;
};

const Users = model('users', UserSchema);

export default Users;