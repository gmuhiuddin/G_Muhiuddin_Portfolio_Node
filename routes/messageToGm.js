import express from 'express';
import Msg from '../models/Msg.js'

const router = express.Router();

router.get('/msg', async (req, res) => {
    const msg = await Msg.find();

    res.send({ msg: "Product fetchedd successfully", messages: msg });
});

router.get('/msg/:msgId', async (req, res) => {

    const { msgId } = req.params;

    const msg = await Msg.findOne({
     _id: msgId   
    });

    res.send({ msg: "Product fetchedd successfully", message: msg });
});

router.post('/sendmsg', async (req, res) => {
    try {
        const msg = await Msg.create(req.body);

        const emailSentSucc = msg.sendMailToUser();

        if (!emailSentSucc) return res.status(400).send({ msg: "Some thing went wrong" });

        res.status(200).send({ msg: "Msg was send successfully" });

    } catch (err) {
        res.status(400).send({ msg: err.message });
    }
});

export default router;