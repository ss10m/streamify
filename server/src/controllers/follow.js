import * as cred from "../config/credentials.js";
import axios from "axios";
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

export const follow = (username, body, sendData, sendError) => {
    if (body.type === "user") return followStreamer(username, body, sendData, sendError);
    if (body.type === "game") return followGame(username, body, sendData, sendError);
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

const followGame = async (user, { data }, sendData, sendError) => {
    //console.log(user, data);
    //let { user, errorUser } = await getUserData(username, sendError);
    //console.log(user);

    let follows = await isFollowingStreamer(user, data.username);
    //console.log(follows);
    if (!follows) return sendError({ message: "Not following " + data.username });

    let followId = follows.id;
    //console.log(followId);

    let game = await getGame(data);
    console.log(game);
    /*
    let query = "INSERT INTO games(id, name, box_art_url) VALUES($1, $2, $3) RETURNING *";
    let values = [data.id, data.name, data.box_art_url];

    
    db.query(query, values)
        .then((res) => {
            if (!res.rows.length) {
                return sendError({ err: "Something went wrong" });
            }
            console.log("SUCCESS");
            console.log(res.rows[0]);
        })
        .catch((err) => {
            if (err && err.code == 23505) return sendError({ err: "Already following" });
            return sendError({ err: "Something went wrong" });
        });
    */

    /*
    let query = "INSERT INTO followed_games(follow_id, game_id) VALUES($1, $2) RETURNING *";
    let values = [4, 509663];
    db.query(query, values)
        .then((res) => {
            if (!res.rows.length) {
                return sendError({ err: "Something went wrong" });
            }
            console.log("SUCCESS");
            console.log(res.rows[0]);
        })
        .catch((err) => {
            console.log(err);
        });
    */
};

export const isFollowingStreamer = async (username, streamer) => {
    let query = `SELECT follows.id, streamers.name as streamer, users.username
                 FROM follows 
                 INNER JOIN users ON users.id = follows.user_id 
                 INNER JOIN streamers ON streamers.id = follows.streamer_id
                 WHERE users.username = $1 AND streamers.name = $2`;
    let values = [username, streamer];
    let result = await db.query(query, values);

    return result.rows[0];
};

const getGame = (game) => {
    let query = `SELECT *
                 FROM games 
                 WHERE id = $1`;
    let values = [game.id];

    return db
        .query(query, values)
        .then((res) => {
            if (res.rows.length) return res.rows[0];
            return insertGame(game);
        })
        .then((res) => {
            if (!res) throw new Error();
            return { game: res, error: null };
        })
        .catch((err) => {
            return { game: null, error: "Internal Server Error" };
        });
};

const insertGame = async (game) => {
    let query = `INSERT INTO games(id, name, box_art_url) 
                 VALUES($1, $2, $3)
                 RETURNING *`;
    let values = [game.id, game.name, game.box_art_url];
    let res = await db.query(query, values);
    if (res.rows.length) return res.rows[0];
    return null;
};
