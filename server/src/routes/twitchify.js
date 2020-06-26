import express from "express";
const router = express.Router();
import { parseError } from "../util/helpers.js";

import { getTopStreamers, getStreamer, followStreamer } from "../controllers/twitchify.js";

router.get("/top", (req, res) => {
    try {
        getTopStreamers((data) => {
            res.send({ data });
        });
    } catch (err) {
        res.status(401).send(parseError(err));
    }
});

router.get("/streamer/:username", (req, res) => {
    let session = req.session;

    let username = req.params.username;
    try {
        getStreamer(username, (data) => {
            res.send({ data });
        });
    } catch (err) {
        res.status(401).send(parseError(err));
    }
});

router.post("/follow", (req, res) => {
    let { session, body } = req;
    followStreamer(session.user.username, body.username);
    res.status(200);
});

export default router;
