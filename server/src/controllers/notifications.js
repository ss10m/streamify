import axios from "axios";
import * as cred from "../config/credentials.js";
import db from "../config/db.js";

const sendNotifications = async (io, connections) => {
    try {
        if (!connections.size) return;
        let srvSockets = io.sockets.sockets;

        let connectedClientsIds = Object.keys(srvSockets).map(
            (socket) => srvSockets[socket].handshake.session.user.id
        );

        let followedStreamers = await getFollowedStreamers(connectedClientsIds);
        if (!followedStreamers.length) return;

        let followedIds = new Set(followedStreamers.map((streamer) => streamer.streamer_id));

        let streamers = await getStreams(followedIds);
        if (!streamers) return;

        let idToStreamer = {};
        for (let steamer of streamers) {
            idToStreamer[steamer.user_id] = steamer;
        }

        for (let connection of connections) {
            notifyUser(connection, idToStreamer);
        }
    } catch (err) {
        return;
    }
};

const removeNotifications = async (session, { id }, cb) => {
    try {
        if (!session.user) throw new Error();
        if (id >= 0) {
            await hideNotification(id);
        } else {
            await hideNotifications(session.user.id);
        }

        let notifications = await getRecentNotifications(session.user.id);
        cb({
            meta: {
                ok: true,
                message: "ok",
            },
            data: { notifications },
        });
    } catch (err) {
        cb({
            meta: {
                ok: false,
                message: "Something went wrong",
            },
            data: {},
        });
    }
};

const hideNotification = async (notificationId) => {
    let query = `UPDATE notifications
                 SET hidden = TRUE
                 WHERE id = $1`;
    let values = [notificationId];
    await db.query(query, values);
    return;
};

const hideNotifications = async (userId) => {
    let query = `UPDATE notifications
                 SET hidden = TRUE
                 FROM follows
                 WHERE follows.user_id = $1 AND follows.id = notifications.follow_id`;
    let values = [userId];
    await db.query(query, values);
    return;
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
        return;
    }
    return response.data.data;
};

const notifyUser = async (connection, idToStreamer) => {
    let user = connection.handshake.session.user;
    let totalNotifications = 0;
    let followedGames = await getFollowedGames(user.id);
    for (let followedGame of followedGames) {
        if (followedGame.streamer_id in idToStreamer) {
            let streamer = idToStreamer[followedGame.streamer_id];
            if (streamer.game_id == followedGame.id) {
                let recentNotification = await getNotifications(
                    followedGame.follow_id,
                    followedGame.id
                );
                if (
                    !recentNotification ||
                    (new Date() - recentNotification.sent_at) / 1000 > 120
                ) {
                    await storeNotification(followedGame.follow_id, followedGame.id);
                    totalNotifications++;
                }
            }
        }
    }

    if (totalNotifications) {
        let newNotifications = await getRecentNotifications(user.id, totalNotifications);
        connection.emit("notification", newNotifications);
    }
};

const getFollowedGames = async (userId) => {
    let query = `SELECT follows.streamer_id, streamers.name AS streamer_name, streamers.display_name, streamers.logo, followed_games.follow_id, games.name, games.id
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

const storeNotification = async (followId, gameId) => {
    let query = `INSERT INTO notifications(follow_id, game_id) 
                 VALUES($1, $2)
                 RETURNING *`;
    let values = [followId, gameId];
    let res = await db.query(query, values);
    return res.rows[0];
};

const getRecentNotifications = async (userId, limit = 10) => {
    let query = `SELECT streamers.display_name, streamers.name, streamers.logo, games.name as game, notifications.sent_at, notifications.id
                 FROM follows
                 INNER JOIN streamers ON streamers.id = follows.streamer_id
                 INNER JOIN notifications ON notifications.follow_id = follows.id
                 INNER JOIN games ON games.id = notifications.game_id
                 WHERE user_id = $1 AND notifications.hidden = false
                 ORDER BY notifications.sent_at DESC
                 LIMIT $2`;
    let values = [userId, limit];
    let res = await db.query(query, values);
    if (!res.rows.length) return [];
    return res.rows;
};

export default sendNotifications;
export { getRecentNotifications, removeNotifications };
