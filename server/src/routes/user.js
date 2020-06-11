import Joi from "joi";
import express from "express";
import { signUp } from "../validations/user.js";
import { parseError, sessionizeUser, encryptPassword } from "../util/helpers.js";
const userRouter = express.Router();

import db from "../config/db.js";

userRouter.post("", async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        console.log(req.body);

        await Joi.validate({ username, email, password, confirmPassword }, signUp);

        const query = "SELECT * FROM users WHERE username = $1";
        const values = [username];
        const result = await db.query(query, values);
        if (result.rows.length) throw new Error("Username already exists");

        const { salt, hash } = encryptPassword(password);
        const queryInsert = "INSERT INTO users(username, email, salt, hash) VALUES($1, $2, $3, $4) RETURNING *";
        const valuesInsert = [username, email, salt, hash];
        const user = await db.query(queryInsert, valuesInsert);

        const sessionUser = sessionizeUser(user.rows[0]);
        req.session.user = sessionUser;
        res.send(sessionUser);
    } catch (err) {
        res.status(401).send(parseError(err));
    }
});

export default userRouter;
