import Joi from "joi";
import express from "express";
import { signUp } from "../validations/user.js";
import { parseError, sessionizeUser, encryptPassword } from "../util/helpers.js";
const userRouter = express.Router();

import db from "../config/db.js";

userRouter.post("", async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        await Joi.validate({ username, email, password, confirmPassword }, signUp);

        const query = "SELECT * FROM users WHERE username = $1";
        const values = [username];
        const result = await db.query(query, values);
        if (result.rows.length) {
            res.send({
                meta: {
                    ok: false,
                    message: "Username already exists",
                    action: "REG_ERROR",
                },
                data: {},
            });
            return;
        }

        const { salt, hash } = encryptPassword(password);
        const queryInsert =
            "INSERT INTO users(username, email, salt, hash) VALUES($1, $2, $3, $4) RETURNING *";
        const valuesInsert = [username, email, salt, hash];
        const user = await db.query(queryInsert, valuesInsert);

        const sessionUser = sessionizeUser(user.rows[0]);
        req.session.user = sessionUser;
        res.send({
            meta: {
                ok: true,
                message: "",
            },
            data: { user: sessionUser },
        });
    } catch (err) {
        let meta = { ok: false, message: parseError(err) };
        if (err.isJoi) meta["action"] = "REG_ERROR";
        res.send({ meta, data: {} });
    }
});

userRouter.get("/guest", async (req, res) => {
    try {
        const query =
            "SELECT * FROM users WHERE username LIKE 'Guest#%' ORDER BY created_at DESC LIMIT 1";
        const result = await db.query(query);

        let lastId;
        if (result.rows.length) {
            let username = result.rows[0].username;
            lastId = parseInt(username.split("#")[1]) + 1;
        } else {
            lastId = 2551;
        }

        const queryInsert =
            "INSERT INTO users(username, email, salt, hash) VALUES($1, $2, $3, $4) RETURNING *";
        const valuesInsert = [`Guest#${lastId}`, "", "", ""];
        const user = await db.query(queryInsert, valuesInsert);

        const sessionUser = sessionizeUser(user.rows[0]);
        req.session.user = sessionUser;
        res.send({
            meta: {
                ok: true,
                message: "",
            },
            data: { user: sessionUser },
        });
    } catch (err) {
        let meta = { ok: false, message: parseError(err) };
        res.send({ meta, data: {} });
    }
});

export default userRouter;
