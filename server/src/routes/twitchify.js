import express from "express";
const router = express.Router();
import { parseError } from "../util/helpers.js";

import { getTopStreamers } from "../controllers/twitchify.js";

router.get("/top", (req, res) => {
    try {
        getTopStreamers((data) => {
            res.send({ data });
        });
    } catch (err) {
        res.status(401).send(parseError(err));
    }
});

export default router;
