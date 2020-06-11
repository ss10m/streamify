import express from "express";
import session from "express-session";
import pgSimpleSession from "connect-pg-simple";

import { SESS_NAME, SESS_SECRET, SESS_LIFETIME } from "../config.js";
import { userRoutes, sessionRoutes } from "./routes/index.js";
import { pgPool } from "./config/db.js";

const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0";
const app = express();
const pgSession = new pgSimpleSession(session);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        name: SESS_NAME,
        secret: SESS_SECRET,
        saveUninitialized: false,
        resave: false,
        store: new pgSession({
            pool: pgPool,
            tableName: "session",
        }),
        cookie: {
            sameSite: true,
            secure: false,
            maxAge: parseInt(SESS_LIFETIME),
        },
    })
);

const apiRouter = express.Router();
app.use("/api", apiRouter);
apiRouter.use("/users", userRoutes);
apiRouter.use("/session", sessionRoutes);

app.listen(PORT, HOST, () => console.log(`Running on http://${HOST}:${PORT}`));
