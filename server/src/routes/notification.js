import sendNotifications from "../controllers/notifications.js";

const connections = new Set();

const setupNotifications = (io) => {
    io.on("connection", (socket) => {
        console.log("new connection: " + socket.handshake.session.user.username);
        connections.add(socket);
        let srvSockets = io.sockets.sockets;
        console.log(Object.keys(srvSockets).length);

        socket.on("disconnect", () => {
            console.log("disconnect");
            connections.delete(socket);
        });
    });
    automateNotifications(io);
};

const automateNotifications = (io) => {
    setInterval(() => sendNotifications(io, connections), 300000);
    //setInterval(() => sendNotifications(io, connections), 5000);
};

export default setupNotifications;
