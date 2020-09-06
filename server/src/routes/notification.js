import express from "express";
const router = express.Router();

import sendNotifications, {
    removeNotifications,
} from "../controllers/notifications.js";

const connections = new Set();

router.post("", ({ session, body }, res) => {
    removeNotifications(session, body, (data) => {
        res.send(data);
    });
});

const setupNotifications = (io) => {
    io.on("connection", (socket) => {
        connections.add(socket);
        socket.on("disconnect", () => {
            connections.delete(socket);
        });
    });
    automateNotifications(io);
};

const automateNotifications = (io) => {
    setInterval(() => sendNotifications(io, connections), 300000);
};

export default router;
export { setupNotifications };
