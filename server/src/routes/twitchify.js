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

router.get("/streamer/:username", ({ session, params }, res) => {
    Twitchify.getStreamer(session, params.username, (data, status = 200) => {
        res.status(status).send(data);
    });
});

router.get("/streamers", ({ session }, res) => {
    Twitchify.getFollows(session, (data, status = 200) => {
        res.status(status).send(data);
    });
});

router.post("/follow", ({ session, body }, res) => {
    Twitchify.follow(session, body, (data, status = 200) => {
        res.status(status).send(data);
    });
});

router.post("/search/", ({ session, body }, res) => {
    Twitchify.search(session, body, (data, status = 200) => {
        res.status(status).send(data);
    });
});

export default router;
