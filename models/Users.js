import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

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

UserSchema.methods.sendLoginMail = async function (ipAddress) {
    const { email } = this;
    
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: process.env.Smtp_User_Name,
            pass: process.env.Smtp_Password,
        },
    });

    const info = await transporter.sendMail({
        from: '"GMuhiuddin-web-department" <gmuhiuddin.web.email>',
        to: email,
        subject: "Login alert", // Subject line
        text: `You login in this ip address ${ipAddress}. If not you, Please contact our support`,
        html: `<button><a href="https://gmuhiuddin.website/support">Customer support</a></button>`,
    });

    return info.messageId;
};

UserSchema.methods.sendSignupMail = async function () {
    const { email } = this;

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: process.env.Smtp_User_Name,
            pass: process.env.Smtp_Password,
        },
    });

    const info = await transporter.sendMail({
        from: '"GMuhiuddin-web-department" <gmuhiuddin.web.email>',
        to: email,
        subject: "Welcome to Gmuhiuddin",
        text: `Welcome to Ghulam muhiuddin portfolio website.`,
    });

    return info.messageId;
};

const Users = model('users', UserSchema);

export default Users;