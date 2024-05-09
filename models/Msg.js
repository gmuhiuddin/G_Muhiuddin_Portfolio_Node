import mongoose from "mongoose";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const { Schema, model } = mongoose;

const msgSchema = new Schema({
    userName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    msg: {
        type: String,
        require: true,
        minLength: "8"
    },
    repleyed: {
        type: Boolean,
        default: false
    }
});

msgSchema.methods.sendMailToUser = async function () {
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
        subject: "Thanks, for Contacting to Ghulam muhiuddin", // Subject line
        text: "Your message was send successfully. Ghulam muhiuddin repley you within 1 to 2 days. Thanks a lot", // plain text body
    });

    return info.messageId;
};

msgSchema.methods.sendRepleyMail = async function (repleyMsg) {
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
        subject: "GMuhiuddin Repley is here", // Subject line
        text: `Repley: "${repleyMsg}".
        Thanks a lot for contacting Ghulam muhiuddin`, // plain text body
    });

    return info.messageId;
};

const Msg = model("msgs", msgSchema);

export default Msg;