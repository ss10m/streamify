import express from "express";
const router = express.Router();
import { parseError } from "../util/helpers.js";

import { getTopStreamers, getStreamer, followStreamer, getFollows } from "../controllers/twitchify.js";
import e from "express";

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

    console.log(session);
    let username = req.params.username;

    try {
        getStreamer(username, (data) => {
            res.send({ data });
        });
    } catch (err) {
        res.status(401).send(parseError(err));
    }
});

router.get("/streamers", (req, res) => {
    let session = req.session;
    if (!session.user) return res.status(401).send(parseError(new Error("You must login first.")));

    getFollows(
        session.user.username,
        (data) => {
            res.status(200).send(data);
        },
        (err) => {
            res.status(401).send(err);
        }
    );
});

router.post("/follow", (req, res) => {
    let { session, body } = req;
    if (!session.user) return res.status(401).send(parseError("You must login first."));

    followStreamer(
        session.user.username,
        body.username,
        (data) => {
            res.status(200).send(data);
        },
        (err) => {
            res.status(401).send(err);
        }
    );
});

export default router;
