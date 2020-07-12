import axios from "axios";
import * as cred from "../config/credentials.js";
import db from "../config/db.js";

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
    //automateNotifications(io);
};

const automateNotifications = (io) => {
    setInterval(() => sendNotifications(io), 10000);
};

const sendNotifications = async (io) => {
    try {
        console.log("=======================-------CONNECTIONS-------====================");
        console.log(connections.size);
        if (!connections.size) return;
        let srvSockets = io.sockets.sockets;

        let ids = "[" + Object.keys(srvSockets).join(" - ") + "]";
        console.log(ids);

        for (let socket of Object.keys(srvSockets)) {
            console.log(srvSockets[socket].handshake.session.user.id);
        }
        console.log("=-=-=-=-=-=-=-=-=-=-=");

        let a = Object.keys(srvSockets).map((socket) => srvSockets[socket].handshake.session.user.id);
        console.log(a);

        let followedStreamers = await getFollowedStreamers(a);
        console.log(followedStreamers);
        if (!followedStreamers.length) return;

        let followedIds = new Set(followedStreamers.map((streamer) => streamer.streamer_id));
        console.log(followedIds);

        let streamers = await getStreams(followedIds);
        if (!streamers) return;
        //console.log(streamers);

        let idToStreamer = {};
        for (let steamer of streamers) {
            idToStreamer[steamer.user_id] = steamer;
        }

        console.log(idToStreamer);

        for (let connection of connections) {
            let user = connection.handshake.session.user;
            connection.emit("notification", user.username + " " + new Date() + ids);
        }
    } catch (err) {
        console.log(err);
    }
};

const getFollowedStreamers = async (ids) => {
    let query = `SELECT *
                 FROM follows 
                 WHERE user_id = ANY($1::int[])`;
    let values = [ids];
    let result = await db.query(query, values);

    if (!result.rows.length) return [];
    return result.rows;
};

const getStreams = async (ids) => {
    let params = "";
    ids.forEach((id) => (params += "&user_id=" + id));
    params = params.substr(1);
    params = "?" + params;

    let options = {
        method: "get",
        url: "https://api.twitch.tv/helix/streams" + params,
        headers: {
            "Client-ID": cred.clientId,
            Authorization: cred.auth,
        },
    };

    let response = await axios(options);
    if (response && response.status != "200") {
        console.log(response.status);
        return;
    }
    return response.data.data;
};

export default setupNotifications;
