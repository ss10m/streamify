import * as cred from "../config/credentials.js";
import axios from "axios";
import { CustomError, handleError } from "../util/helpers.js";
import db from "../config/db.js";

export const getFollows = async (username, sendData, sendError) => {
    let query = `SELECT streamers.name, streamers.display_name, streamers.logo, follows.followed_at
                 FROM follows 
                 INNER JOIN users ON users.id = follows.user_id 
                 INNER JOIN streamers ON streamers.id = follows.streamer_id
                 WHERE users.username = $1`;
    let values = [username];
    let result = await db.query(query, values);

    for (let res of result.rows) {
        console.log(` => ${username} follows ${res.display_name} since ${res.followed_at}'`);
    }

    sendData(result.rows);
};

const getUserData = (username) => {
    let query = "SELECT * FROM users WHERE username = $1";
    let values = [username];
    return db
        .query(query, values)
        .then((res) => {
            if (!res.rows.length) throw new Error("User not found");
            return { user: res.rows[0], errorUser: null };
        })
        .catch((err) => {
            return { user: null, errorUser: err.message };
        });
};

const getStreamerData = async (username) => {
    let query = "SELECT * FROM streamers WHERE name = $1";
    let values = [username];

    return db
        .query(query, values)
        .then((res) => {
            if (res.rows.length) {
                return res.rows[0];
            }
            return getUser(username);
        })
        .then((res) => {
            return { streamer: res, errorStreamer: null };
        })
        .catch((err) => {
            console.log(err.message);
            return { streamer: null, errorStreamer: "Already following" };
        });
};

const getUser = async (username) => {
    let options = {
        method: "get",
        url: "https://api.twitch.tv/helix/users?login=" + username,
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

    let { login, id, display_name, profile_image_url, offline_image_url } = response.data.data[0];
    let streamer = { name: login, id, display_name, logo: profile_image_url, offline_img: offline_image_url };
    await addStreamer(streamer);
    return streamer;
};

const addStreamer = async (streamer) => {
    let query =
        "INSERT INTO streamers(name, id, display_name, logo, offline_img) VALUES($1, $2, $3, $4, $5) RETURNING *";
    let values = [streamer.name, streamer.id, streamer.display_name, streamer.logo, streamer.offline_img];
    await db.query(query, values);
};

export const follow = (session, body, cb) => {
    if (!session.user) return cb({ message: "You must be logged in", code: 2 }, 401);
    let username = session.user.username;
    if (body.type === "user") return followStreamer(username, body, cb);
    if (body.type === "game") return followGame(username, body, cb);
};

const followStreamer = async (username, body, sendData, sendError) => {
    let { user, errorUser } = await getUserData(username, sendError);
    if (!user) return sendError({ err: errorUser });

    let { streamer, errorStreamer } = await getStreamerData(body.data.username, sendError);
    if (!streamer) return sendError({ err: errorStreamer });

    let query = "INSERT INTO follows(user_id, streamer_id) VALUES($1, $2) RETURNING *";
    let values = [user.id, streamer.id];
    db.query(query, values)
        .then((res) => {
            if (!res.rows.length) {
                return sendError({ err: "Something went wrong" });
            }
            sendData({ status: "ok" });
        })
        .catch((err) => {
            if (err && err.code == 23505) return sendError({ err: "Already following" });
            return sendError({ err: "Something went wrong" });
        });
};

const followGame = async (user, { data }, cb) => {
    try {
        let followsStreamer = await isFollowingStreamer(user, data.username);
        if (!followsStreamer) throw new CustomError(`Not following ${data.username}`, 401, 3);

        let game = await getGame(data);
        if (!game) throw new Error();

        let followsGame = await isFollowingGame(followsStreamer.id, game.id);
        if (followsGame) throw new CustomError(`Already following ${game.name}`, 401, 4);

        let followedGame = await startFollowingGame(followsStreamer.id, game.id);
        if (!followedGame) throw new Error();
        let followedGames = await getFollowedGames(followsStreamer.id);

        cb(followedGames);
    } catch (err) {
        console.log(err);
        handleError(err, cb);
    }
};

const isFollowingStreamer = async (username, streamer) => {
    let query = `SELECT follows.id, streamers.name as streamer, users.username
                 FROM follows 
                 INNER JOIN users ON users.id = follows.user_id 
                 INNER JOIN streamers ON streamers.id = follows.streamer_id
                 WHERE users.username = $1 AND streamers.name = $2`;
    let values = [username, streamer];
    let result = await db.query(query, values);
    if (!result.rows.length) return null;
    return result.rows[0];
};

const getGame = async (game) => {
    let query = `SELECT *
                 FROM games 
                 WHERE id = $1`;
    let values = [game.id];

    let result = await db.query(query, values);
    if (!result.rows.length) return insertGame(game);
    return result.rows[0];
};

const insertGame = async (game) => {
    let query = `INSERT INTO games(id, name, box_art_url) 
                 VALUES($1, $2, $3)
                 RETURNING *`;
    let values = [game.id, game.name, game.box_art_url];
    let res = await db.query(query, values);
    if (!res.rows.length) return null;
    return res.rows[0];
};

const isFollowingGame = async (followId, gameId) => {
    let query = `SELECT *
                 FROM followed_games 
                 WHERE followed_games.follow_id = $1 AND followed_games.game_id = $2`;
    let values = [followId, gameId];
    let result = await db.query(query, values);
    if (!result.rows.length) return null;
    return result.rows[0];
};

const startFollowingGame = async (followId, gameId) => {
    let query = "INSERT INTO followed_games(follow_id, game_id) VALUES($1, $2) RETURNING *";
    let values = [followId, gameId];
    let result = await db.query(query, values);
    if (!result.rows.length) return null;
    return result.rows[0];
};

const getFollowedGames = async (followId) => {
    let query = `SELECT id, name, box_art_url
                 FROM followed_games 
                 INNER JOIN games ON games.id = followed_games.game_id
                 WHERE followed_games.follow_id = $1`;
    let values = [followId];
    let result = await db.query(query, values);
    if (!result.rows.length) return [];
    return result.rows;
};
