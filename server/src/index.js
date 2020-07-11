import express from "express";
import session from "express-session";
import pgSimpleSession from "connect-pg-simple";
import path from "path";
import http from "http";
import ioClient from "socket.io";
//var sharedsession = require("express-socket.io-session");
import sharedsession from "express-socket.io-session";

import { SESS_NAME, SESS_SECRET, SESS_LIFETIME } from "../config.js";
import { userRoutes, sessionRoutes, twitchifyRoutes, notificationRoutes } from "./routes/index.js";
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
        sameSite: true,
        secure: false,
        maxAge: parseInt(SESS_LIFETIME),
    },
});

app.use(expressSession);
io.use(sharedsession(expressSession));

const connections = new Set();

io.on("connection", (socket) => {
    console.log("new connection");
    connections.add(socket);
    //console.log(socket.handshake.session.user);
    let srvSockets = io.sockets.sockets;
    console.log(Object.keys(srvSockets).length);

    socket.on("disconnect", () => {
        connections.delete(socket);
        console.log("disconnect");
        //console.log(Object.keys(srvSockets).length);
        //console.log(Object.keys(srvSockets));
        //console.log(srvSockets);
    });
});

/*
setInterval(() => {
    console.log("=======================-------CONNECTIONS-------====================");
    console.log(connections.size);
    let srvSockets = io.sockets.sockets;

    let ids = "[" + Object.keys(srvSockets).join(" - ") + "]";
    console.log(ids);

    for (let connection of connections) {
        let user = connection.handshake.session.user;
        connection.emit("notification", user.username + " " + new Date() + ids);
    }
}, 10000);
*/

const apiRouter = express.Router();
app.use("/api", apiRouter);
apiRouter.use("/users", userRoutes);
apiRouter.use("/session", sessionRoutes);
apiRouter.use("/twitchify", twitchifyRoutes);
apiRouter.use("/notifications", notificationRoutes);

app.get("*", (request, response) => {
    response.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
});

server.listen(PORT, HOST, () => console.log(`Running on http://${HOST}:${PORT}`));
