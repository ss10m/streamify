import * as cred from "../config/credentials.js";
import axios from "axios";
import db from "../config/db.js";

import _ from "lodash";

import { topGames } from "../util/topGames.js";

export const getStreamer = async (session, streamerName, cb) => {
    try {
        let username = session.user ? session.user.username : "";
        let user = await getUser(streamerName);
        if (!user) {
            cb({
                meta: {
                    ok: false,
                    message: "Streamer not found",
                },
                data: {},
            });
            return;
        }

        let [stream, recent] = await Promise.all([
            getStream(user.login),
            getRecentGames(user.id),
        ]);

        let recentGames = [];
        if (recent.length) recentGames = await getRecentGamesBoxArt(recent);

        let streamer = parseData(user, stream, recentGames);

        let {
            isFollowing,
            followedAt,
            followedGames,
        } = await isFollowingStreamer(username, user.login);

        streamer.following = isFollowing;
        streamer.followed_at = followedAt;
        streamer.followed_games = followedGames;

        let response = {
            meta: {
                ok: true,
                message: "ok",
            },
            data: { streamer },
        };

        cb(response);
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
        return;
    }
    return response.data.data[0];
};

const getStream = async (username) => {
    let options = {
        method: "get",
        url: "https://api.twitch.tv/helix/streams?user_login=" + username,
        headers: {
            "Client-ID": cred.clientId,
            Authorization: cred.auth,
        },
    };

    let response = await axios(options);
    if (response && response.status != "200") {
        return;
    }
    return response.data.data[0];
};

const getRecentGames = async (streamerId) => {
    var options = {
        method: "GET",
        url:
            "https://api.twitch.tv/kraken/channels/" +
            streamerId +
            "/videos?broadcast_type=archive&limit=50",
        headers: {
            "Client-ID": cred.clientId,
            Accept: "application/vnd.twitchtv.v5+json",
        },
    };

    let response = await axios(options);
    if (response && response.status != "200") {
        return;
    }

    if (response.data._total === 0) return [];
    let channel = response.data.videos[0].channel;

    let videos = response.data.videos;

    let recentGames = new Set();
    let currentGame = channel.game.toLowerCase();
    if (currentGame && !currentGame.includes("&")) recentGames.add(currentGame);
    for (let video of videos) {
        let game = video.game.toLowerCase();
        if (!game.includes("&")) recentGames.add(game);
    }

    let recentGamesArray = Array.from(recentGames);
    return recentGamesArray;
};

const getRecentGamesBoxArt = async (recentGames) => {
    var requestParameters = "";

    Array.from(recentGames).forEach((recentGame) => {
        var alphaNumeric = /^[a-z\d\-_\s\'\!\:\+]+$/i;
        if (recentGame.match(alphaNumeric)) {
            requestParameters += "&name=" + recentGame;
        }
    });

    requestParameters = requestParameters.substr(1);

    var options = {
        method: "GET",
        url: "https://api.twitch.tv/helix/games?" + requestParameters,
        headers: {
            "Client-ID": cred.clientId,
            Authorization: cred.auth,
        },
    };

    let response = await axios(options);
    if (response && response.status != "200") {
        return;
    }

    for (let game of response.data.data) {
        game.box_art_url = game.box_art_url.replace(/{width}/g, "200");
        game.box_art_url = game.box_art_url.replace(/{height}/g, "300");
    }

    return response.data.data;
};

const parseData = (user, stream, recentGames) => {
    let streamer = {};
    streamer.name = user.login;
    streamer.display_name = user.display_name;
    streamer.logo = user.profile_image_url;
    streamer.preview = user.offline_image_url;
    if (recentGames.length < 8) {
        getGamesSuggestions(recentGames);
    }
    streamer.recent_games = recentGames;
    if (stream) {
        let preview = stream.thumbnail_url;
        preview = preview.replace(/{width}/g, "450");
        preview = preview.replace(/{height}/g, "240");
        streamer.preview = preview;
        let gameName,
            gameLogo = "";
        for (let game of recentGames) {
            if (game.id === stream.game_id) {
                gameName = game.name;
                gameLogo = game.box_art_url;
            }
        }
        streamer.stream = {
            game: gameName,
            game_box_art_url: gameLogo,
            viewers: roundedToFixed(stream.viewer_count, 1),
            started_at: stream.started_at,
            title: stream.title,
        };
    }
    return streamer;
};

const getGamesSuggestions = async (recentGames) => {
    let query = `SELECT *
                 FROM game_suggestions`;
    let values = [];
    let res = await db.query(query, values);
    let suggestions = _.shuffle(res.rows);

    let recentGamesIds = new Set();
    for (let game of recentGames) {
        recentGamesIds.add(game.id);
    }

    let numRecentGames = recentGamesIds.size;
    let suggestionsIndex = 0;

    while (numRecentGames <= 8 && suggestionsIndex < suggestions.length) {
        let current = suggestions[suggestionsIndex];
        if (!recentGamesIds.has(current.id)) {
            current["suggestion"] = true;
            recentGames.push(current);
            numRecentGames++;
        }
        suggestionsIndex++;
    }
};

const roundedToFixed = (number, digits) => {
    if (number < 1000) return number;
    let float = number / 1000;
    let rounded = Math.pow(10, digits);
    let viewers = (Math.round(float * rounded) / rounded).toFixed(digits);
    if (viewers % 1 == 0) viewers = parseInt(viewers);
    return viewers + "K";
};

const isFollowingStreamer = async (username, streamer) => {
    let query = `SELECT follows.id as follow_id, follows.followed_at, games.id, games.name, games.box_art_url
                 FROM follows 
                 INNER JOIN users ON users.id = follows.user_id 
                 INNER JOIN streamers ON streamers.id = follows.streamer_id
                 LEFT JOIN followed_games ON followed_games.follow_id = follows.id 
                 LEFT JOIN games on games.id = followed_games.game_id
                 WHERE users.username = $1 AND streamers.name = $2
                 ORDER BY followed_games.followed_at`;
    let values = [username, streamer];
    let result = await db.query(query, values);

    let isFollowing = result.rows.length > 0;
    let followedAt = null;
    if (isFollowing) followedAt = result.rows[0].followed_at;
    let followedGames = [];
    for (let game of result.rows) {
        delete game.follow_id;
        if (game.id) followedGames.push(game);
    }
    return { isFollowing, followedAt, followedGames };
};

const handleTopGames = async () => {
    for (let game of topGames) {
        let query = `INSERT INTO game_suggestions(id, name, box_art_url) 
                 VALUES($1, $2, $3)
                 RETURNING *`;
        let values = [game.id, game.name, game.box_art_url];
        await db.query(query, values);
    }
};

//handleTopGames();
