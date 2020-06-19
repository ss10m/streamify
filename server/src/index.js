import express from "express";
import session from "express-session";
import pgSimpleSession from "connect-pg-simple";
import path from "path";

import { SESS_NAME, SESS_SECRET, SESS_LIFETIME } from "../config.js";
import { userRoutes, sessionRoutes, twitchifyRoutes } from "./routes/index.js";
import { pgPool } from "./config/db.js";

const PORT = 8080;
const HOST = "0.0.0.0";
const app = express();
const pgSession = new pgSimpleSession(session);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const CLIENT_BUILD_PATH = path.join(path.resolve(), "../client/build");
app.use(express.static(CLIENT_BUILD_PATH));

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
apiRouter.use("/twitchify", twitchifyRoutes);

app.get("*", function (request, response) {
    response.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
});

app.listen(PORT, HOST, () => console.log(`Running on http://${HOST}:${PORT}`));
