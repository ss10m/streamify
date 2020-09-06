import express from "express";
const router = express.Router();

import * as Twitchify from "../controllers/index.js";

router.get("/top", (req, res) => {
    Twitchify.getTopStreamers((data) => {
        res.send(data);
    });
});

router.get("/streamer/:username", ({ session, params }, res) => {
    Twitchify.getStreamer(session, params.username, (data) => {
        res.send(data);
    });
});

router.get("/streamers", ({ session }, res) => {
    Twitchify.getFollows(session, (data) => {
        res.send(data);
    });
});

router.post("/follow", ({ session, body }, res) => {
    Twitchify.follow(session, body, (data) => {
        res.send(data);
    });
});

router.post("/search/", ({ session, body }, res) => {
    Twitchify.search(session, body, (data) => {
        res.send(data);
    });
});

export default router;
