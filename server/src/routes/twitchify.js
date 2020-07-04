import express from "express";
const router = express.Router();
import { parseError } from "../util/helpers.js";

import * as Twitchify from "../controllers/index.js";

router.get("/top", (req, res) => {
    try {
        Twitchify.getTopStreamers((data) => {
            res.send({ data });
        });
    } catch (err) {
        res.status(401).send(parseError(err));
    }
});

router.get("/streamer/:username", (req, res) => {
    let session = req.session;

    //console.log(session);
    let username = req.params.username;

    try {
        Twitchify.getStreamer(username, (data) => {
            res.send({ data });
        });
    } catch (err) {
        res.status(401).send(parseError(err));
    }
});

router.get("/streamers", (req, res) => {
    let session = req.session;
    if (!session.user) return res.status(401).send(parseError(new Error("You must login first.")));

    Twitchify.getFollows(
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

    Twitchify.follow(
        session.user.username,
        body,
        (data) => {
            res.status(200).send(data);
        },
        (err) => {
            res.status(401).send(err);
        }
    );
});

router.post("/search/", (req, res) => {
    let { body } = req;

    Twitchify.search(
        body,
        (data) => {
            res.status(200).send(data);
        },
        (err) => {
            res.status(401).send(err);
        }
    );
});

export default router;
