import * as cred from "../config/credentials.js";
import axios from "axios";
import { CustomError, handleError } from "../util/helpers.js";
import db from "../config/db.js";

// ACTIONS
const FOLLOW_STREAMER = "FOLLOW_STREAMER";
const UNFOLLOW_STREAMER = "UNFOLLOW_STREAMER";
const FOLLOW_GAME = "FOLLOW_GAME";
const UNFOLLOW_GAME = "UNFOLLOW_GAME";
const LOGIN = "LOGIN";
const NONE = "NONE";

export const getFollows = async (session, cb) => {
    if (!session.user) return cb({ message: "You must be logged in" }, 401);
    let username = session.user.username;

    try {
        let query = `SELECT streamers.id, streamers.name, streamers.display_name, streamers.logo, follows.followed_at
                     FROM follows
                     INNER JOIN users ON users.id = follows.user_id
                     INNER JOIN streamers ON streamers.id = follows.streamer_id
                     WHERE users.username = $1`;
        let values = [username];
        let result = await db.query(query, values);

        let followed = result.rows;

        let ids = followed.map((stream) => stream.id);

        let streams = await getStreams(ids);

        let liveStreams = new Map(streams.map((stream) => [parseInt(stream.user_id), stream]));

        for (let stream of followed) {
            if (liveStreams.has(stream.id)) {
                stream.live = true;
            } else {
                stream.live = false;
            }
        }
        cb(followed);
    } catch (err) {
        handleError(err, cb);
    }
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

export const follow = (session, body, cb) => {
    if (!session.user) return cb({ message: "You must be logged in", action: LOGIN }, 401);
    let username = session.user.username;

    switch (body.action) {
        case FOLLOW_STREAMER:
            followStreamer(username, body, cb);
            break;
        case UNFOLLOW_STREAMER:
            unfollowStreamer(username, body, cb);
            break;
        case FOLLOW_GAME:
            followGame(username, body, cb);
            break;
        case UNFOLLOW_GAME:
            unfollowGame(username, body, cb);
            break;
    }
};

const followStreamer = async (username, { data }, cb) => {
    try {
        let streamerName = data.username;

        let isFollowing = await isFollowingStreamer(username, streamerName);
        if (isFollowing) return cb({ status: "ok" });

        let streamer = await getStreamerData(streamerName);
        if (!streamer) throw new Error();

        let user = await getUserData(username);

        let query = "INSERT INTO follows(user_id, streamer_id) VALUES($1, $2) RETURNING *";
        let values = [user.id, streamer.id];

        let result = await db.query(query, values);
        if (!result.rows.length) throw new Error();
        cb({ status: "ok" });
    } catch (err) {
        handleError(err, cb);
    }
};

const unfollowStreamer = async (username, { data }, cb) => {
    try {
        let streamerName = data.username;

        let isFollowing = await isFollowingStreamer(username, streamerName);
        if (!isFollowing) return cb({ status: "ok" });

        let query = `DELETE FROM follows 
                     WHERE id = $1
                     RETURNING *`;
        let values = [isFollowing.id];
        await db.query(query, values);

        cb({ status: "ok" });
    } catch (err) {
        handleError(err, cb);
    }
};

const followGame = async (user, { data }, cb) => {
    try {
        let followsStreamer = await isFollowingStreamer(user, data.username);
        if (!followsStreamer) throw new CustomError(`Not following ${data.username}`, 401, FOLLOW_STREAMER);

        let game = await getGame(data);
        if (!game) throw new Error();

        let followsGame = await isFollowingGame(followsStreamer.id, game.id);
        if (followsGame) throw new CustomError(`Already following ${game.name}`, 401, NONE);

        let followedGame = await startFollowingGame(followsStreamer.id, game.id);
        if (!followedGame) throw new Error();
        let followedGames = await getFollowedGames(followsStreamer.id);

        cb(followedGames);
    } catch (err) {
        handleError(err, cb);
    }
};

const unfollowGame = async (user, { data }, cb) => {
    try {
        let followsStreamer = await isFollowingStreamer(user, data.username);
        if (!followsStreamer) throw new CustomError(`Not following ${data.username}`, 401);

        let followsGame = await isFollowingGame(followsStreamer.id, data.id);
        if (!followsGame) throw new CustomError(`Not following ${data.name}`, 401);

        let query = `DELETE FROM followed_games 
                     WHERE follow_id = $1 AND game_id = $2
                     RETURNING *`;
        let values = [followsGame.follow_id, followsGame.game_id];
        let result = await db.query(query, values);
        if (!result.rows.length) throw new Error();

        let followedGames = await getFollowedGames(followsStreamer.id);
        cb(followedGames);
    } catch (err) {
        handleError(err, cb);
    }
};

const getUserData = async (username) => {
    let query = "SELECT * FROM users WHERE username = $1";
    let values = [username];
    let result = await db.query(query, values);
    if (!result.rows.length) return null;
    return result.rows[0];
};

const getStreamerData = async (username) => {
    let query = "SELECT * FROM streamers WHERE name = $1";
    let values = [username];

    let result = await db.query(query, values);
    if (result.rows.length) return result.rows[0];

    let streamer = await getUser(username);
    return streamer;
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
        return null;
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
                 WHERE followed_games.follow_id = $1
                 ORDER BY followed_games.followed_at`;
    let values = [followId];
    let result = await db.query(query, values);
    if (!result.rows.length) return [];
    return result.rows;
};
