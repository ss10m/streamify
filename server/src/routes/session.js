import express from "express";
import Joi from "joi";

import { signIn } from "../validations/user.js";
import { parseError, sessionizeUser, verifyPassword } from "../util/helpers.js";
import { SESS_NAME } from "../../config.js";
import { getRecentNotifications } from "../controllers/notifications.js";

const router = express.Router();

import db from "../config/db.js";

router.post("", async (req, res) => {
    try {
        const { username, password } = req.body;
        await Joi.validate({ username, password }, signIn);
        const query = "SELECT * FROM users WHERE username = $1";
        const values = [username];
        const result = await db.query(query, values);
        if (!result.rows.length) {
            res.send({
                meta: {
                    ok: false,
                    message: "Account does not exist!",
                    action: "LOGIN_ERROR",
                },
                data: {},
            });
            return;
        }

        const user = result.rows[0];
        if (user && verifyPassword(user, password)) {
            const sessionUser = sessionizeUser(user);
            req.session.user = sessionUser;
            let notifications = [];
            if (user) notifications = await getRecentNotifications(user.id);
            res.send({
                meta: {
                    ok: true,
                    message: "",
                },
                data: { user: sessionUser, notifications },
            });
        } else {
            res.send({
                meta: {
                    ok: false,
                    message: "Invalid login credentials",
                    action: "LOGIN_ERROR",
                },
                data: {},
            });
            return;
        }
    } catch (err) {
        let meta = { ok: false, message: parseError(err) };
        if (err.isJoi) meta["action"] = "LOGIN_ERROR";
        res.send({ meta, data: {} });
    }
});

router.delete("", ({ session }, res) => {
    try {
        const user = session.user;
        if (!user) throw new Error();
        session.destroy((err) => {
            if (err) throw err;
            res.clearCookie(SESS_NAME);
            res.send({ meta: { ok: true, message: "" }, data: {} });
        });
    } catch (err) {
        res.send({ meta: { ok: false, message: parseError(err) }, data: {} });
    }
});

router.get("", async ({ session: { user } }, res) => {
    try {
        let notifications = [];
        if (user) notifications = await getRecentNotifications(user.id);
        res.send({
            meta: { ok: true, message: "" },
            data: { user, notifications },
        });
    } catch (err) {
        res.send({ meta: { ok: false, message: parseError(err) }, data: {} });
    }
});

export default router;
