import express from "express";
import Joi from "joi";

import { signIn } from "../validations/user.js";
import { parseError, sessionizeUser, verifyPassword } from "../util/helpers.js";
import { SESS_NAME } from "../../config.js";
import { getRecentNotifications } from "./notification.js";

const sessionRouter = express.Router();

import db from "../config/db.js";

sessionRouter.post("", async (req, res) => {
    console.log("sign in");

    try {
        const { username, password } = req.body;
        console.log(req.body);

        await Joi.validate({ username, password }, signIn);

        const query = "SELECT * FROM users WHERE username = $1";
        const values = [username];
        const result = await db.query(query, values);
        if (!result.rows.length) throw new Error("Account does not exist!");

        const user = result.rows[0];
        if (user && verifyPassword(user, password)) {
            const sessionUser = sessionizeUser(user);
            req.session.user = sessionUser;
            let notifications = [];
            if (user) notifications = await getRecentNotifications(user.id);
            res.send({ user: sessionUser, notifications });
        } else {
            throw new Error("Invalid login credentials");
        }
    } catch (err) {
        res.status(401).send(parseError(err));
    }
});

sessionRouter.delete("", ({ session }, res) => {
    try {
        const user = session.user;
        if (user) {
            session.destroy((err) => {
                if (err) throw err;
                res.clearCookie(SESS_NAME);
                res.send(user);
            });
        } else {
            throw new Error("Something went wrong");
        }
    } catch (err) {
        res.status(422).send(parseError(err));
    }
});

sessionRouter.get("", async ({ session: { user } }, res) => {
    let notifications = [];
    if (user) notifications = await getRecentNotifications(user.id);
    res.send({ user, notifications });
});

export default sessionRouter;
