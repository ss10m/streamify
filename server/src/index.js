import express from "express";
import session from "express-session";
import pgSimpleSession from "connect-pg-simple";
import path from "path";
import http from "http";
import ioClient from "socket.io";
import sharedsession from "express-socket.io-session";

import { SESS_NAME, SESS_SECRET, SESS_LIFETIME } from "./config/session.js";
import {
    userRoutes,
    sessionRoutes,
    twitchifyRoutes,
    notificationsRoutes,
    setupNotifications,
} from "./routes/index.js";
import { pgPool } from "./config/db.js";

const PORT = 8080;
const HOST = "0.0.0.0";
const app = express();
const pgSession = new pgSimpleSession(session);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const CLIENT_BUILD_PATH = path.join(path.resolve(), "../client/build");
app.use(express.static(CLIENT_BUILD_PATH));

const server = http.Server(app);
const io = ioClient(server);

let expressSession = session({
    name: SESS_NAME,
    secret: SESS_SECRET,
    saveUninitialized: false,
    resave: false,
    store: new pgSession({
        pool: pgPool,
        tableName: "session",
    }),
    cookie: {
        maxAge: parseInt(SESS_LIFETIME),
    },
});

app.use(expressSession);
io.use(sharedsession(expressSession));
setupNotifications(io);

const apiRouter = express.Router();
app.use("/api", apiRouter);
apiRouter.use("/users", userRoutes);
apiRouter.use("/session", sessionRoutes);
apiRouter.use("/twitchify", twitchifyRoutes);
apiRouter.use("/notifications", notificationsRoutes);

app.get("*", (request, response) => {
    response.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
});

server.listen(PORT, HOST, () => console.log(`Running on http://${HOST}:${PORT}`));
