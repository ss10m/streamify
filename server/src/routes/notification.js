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
    automateNotifications(io);
};

const automateNotifications = (io) => {
    setInterval(() => sendNotifications(io), 300000);
};

const sendNotifications = async (io) => {
    try {
        console.log("=======================-------NOTIFICATIONS-------====================");
        console.log("# of connections: " + connections.size);
        if (!connections.size) return;
        let srvSockets = io.sockets.sockets;

        let connectedClientsIds = Object.keys(srvSockets).map((socket) => srvSockets[socket].handshake.session.user.id);

        let followedStreamers = await getFollowedStreamers(connectedClientsIds);
        if (!followedStreamers.length) return;

        let followedIds = new Set(followedStreamers.map((streamer) => streamer.streamer_id));

        let streamers = await getStreams(followedIds);
        if (!streamers) return;

        let idToStreamer = {};
        for (let steamer of streamers) {
            idToStreamer[steamer.user_id] = steamer;
        }

        let ids = "[" + Object.keys(srvSockets).join(" - ") + "]";
        for (let connection of connections) {
            notifyUser(connection, idToStreamer, ids);
        }
    } catch (err) {
        console.log(err.message);
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

const notifyUser = async (connection, idToStreamer, ids) => {
    let user = connection.handshake.session.user;
    console.log(user);
    let newNotifications = [];
    let followedGames = await getFollowedGames(user.id);
    for (let followedGame of followedGames) {
        if (followedGame.streamer_id in idToStreamer) {
            let streamer = idToStreamer[followedGame.streamer_id];
            if (streamer.game_id == followedGame.id) {
                // send new notficiation if time since last one is > 60 sec
                let recentNotification = await getNotifications(followedGame.follow_id, followedGame.id);
                if (!recentNotification || (new Date() - recentNotification.sent_at) / 1000 > 120) {
                    console.log(`${followedGame.display_name} IS PLAYING ${followedGame.name}`);
                    let msg = {
                        display_name: followedGame.display_name,
                        logo: followedGame.logo,
                        game: followedGame.name,
                        sent_at: new Date(),
                    };

                    storeNotification(followedGame.follow_id, followedGame.id);

                    newNotifications.push(msg);
                }
            }
        }
    }
    if (newNotifications.length) connection.emit("notification", newNotifications);
    connection.emit("update", user.username + " " + new Date() + ids);
};

const getFollowedGames = async (userId) => {
    let query = `SELECT follows.streamer_id, streamers.display_name, streamers.logo, followed_games.follow_id, games.name, games.id
                 FROM follows 
                 INNER JOIN streamers on streamers.id = follows.streamer_id
                 INNER JOIN followed_games on follow_id = follows.id
                 INNER JOIN games on games.id = followed_games.game_id
                 WHERE user_id = $1`;
    let values = [userId];
    let result = await db.query(query, values);
    return result.rows;
};

const getNotifications = async (followId, gameId) => {
    let query = `SELECT *
                 FROM notifications
                 WHERE follow_id = $1 AND game_id = $2
                 ORDER BY sent_at DESC
                 LIMIT 1`;
    let values = [followId, gameId];
    let res = await db.query(query, values);
    if (!res.rows.length) return null;
    return res.rows[0];
};

const storeNotification = (followId, gameId) => {
    let query = `INSERT INTO notifications(follow_id, game_id) 
                 VALUES($1, $2)
                 RETURNING *`;
    let values = [followId, gameId];
    db.query(query, values);
};

const getRecentNotifications = async (userId) => {
    let query = `SELECT streamers.display_name, streamers.logo, games.name, notifications.sent_at, notifications.id
                 FROM follows
                 INNER JOIN streamers ON streamers.id = follows.streamer_id
                 INNER JOIN notifications ON notifications.follow_id = follows.id
                 INNER JOIN games ON games.id = notifications.game_id
                 WHERE user_id = $1 AND notifications.hidden = false
                 ORDER BY notifications.sent_at DESC
                 LIMIT 10`;
    let values = [userId];
    let res = await db.query(query, values);
    if (!res.rows.length) return [];
    return res.rows;
};

export default setupNotifications;
export { getRecentNotifications };
