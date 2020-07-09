import * as cred from "../config/credentials.js";
import axios from "axios";
import db from "../config/db.js";

import { handleError } from "../util/helpers.js";

const SEARCH_USERS = "USERS";
const SEARCH_GAMES = "GAMES";

export const search = (session, data, cb) => {
    if (data.type === SEARCH_USERS) return searchUsers(data, cb);
    if (data.type === SEARCH_GAMES) return searchGames(session, data, cb);
};

const searchUsers = async (data, cb) => {
    let options = {
        method: "get",
        url: "https://api.twitch.tv/helix/search/channels?query=" + data.query,
        headers: {
            "Client-ID": cred.clientId,
            Authorization: cred.auth,
        },
        params: {
            first: 10,
        },
    };

    let response;
    try {
        response = await axios(options);
    } catch (err) {
        return cb({ message: "Something went wrong" });
    }

    if (response.status != "200") {
        return cb({ message: "Something went wrong" });
    }

    cb(response.data.data);
};

const searchGames = async ({ user }, data, cb) => {
    try {
        let username = user.username;

        let options = {
            method: "get",
            url: "https://api.twitch.tv/helix/search/categories?query=" + data.query,
            headers: {
                "Client-ID": cred.clientId,
                Authorization: cred.auth,
            },
            params: {
                first: 10,
            },
        };

        let response = await axios(options);
        if (response && response.status != "200") {
            throw new Error();
        }

        let result = response.data.data;
        if (!result) return cb({ data: [] });

        let followedGames = await getFollowedGames(username, data.username);
        let gameIds = new Set();
        for (let followedGame of followedGames) {
            gameIds.add(followedGame.id);
        }

        for (let game of result) {
            game.following = gameIds.has(parseInt(game.id));
            game.box_art_url = game.box_art_url.replace("52x72", "67x100");
            console.log(game);
        }

        cb(result);
    } catch (err) {
        console.log(err.message);
        handleError(err, cb);
    }
};

const getFollowedGames = async (username, streamerName) => {
    let query = `SELECT games.id
                 FROM follows 
                 INNER JOIN users ON users.username = $1
                 INNER JOIN streamers ON streamers.name = $2 
                 INNER JOIN followed_games ON followed_games.follow_id = follows.id
                 INNER JOIN games on games.id = followed_games.game_id
                 WHERE follows.user_id = users.id AND follows.streamer_id = streamers.id`;
    let values = [username, streamerName];
    let result = await db.query(query, values);
    if (!result.rows.length) return [];
    return result.rows;
};
