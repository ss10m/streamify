import * as cred from "../config/credentials.js";
import axios from "axios";
import db from "../config/db.js";

export const getStreamer = async (session, streamerName, cb) => {
    try {
        let username = session.user ? session.user.username : "";
        let user = await getUser(streamerName);
        let [stream, recent] = await Promise.all([getStream(user.login), getRecentGames(user.id)]);

        let recentGames = [];
        if (recent.length) recentGames = await getRecentGamesBoxArt(recent);

        let streamer = parseData(user, stream, recentGames);

        let { isFollowing, followedGames } = await isFollowingStreamer(username, user.login);
        console.log(isFollowing, followedGames);

        streamer.following = isFollowing;
        streamer.followed_games = followedGames;

        cb(streamer);
    } catch (err) {
        console.log(err);
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
        console.log(response.status);
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
        console.log(response.status);
        return;
    }
    return response.data.data[0];
};

const getRecentGames = async (streamerId) => {
    var options = {
        method: "GET",
        url: "https://api.twitch.tv/kraken/channels/" + streamerId + "/videos?broadcast_type=archive&limit=50",
        headers: {
            "Client-ID": cred.clientId,
            Accept: "application/vnd.twitchtv.v5+json",
        },
    };

    let response = await axios(options);
    if (response && response.status != "200") {
        console.log(response.status);
        return;
    }

    if (response.data._total === 0) return [];
    let channel = response.data.videos[0].channel;

    let videos = response.data.videos;

    var recentGames = new Set();
    recentGames.add(channel.game.toLowerCase());
    for (let video of videos) {
        recentGames.add(video.game.toLowerCase());
    }

    let recentGamesArray = Array.from(recentGames);
    return recentGamesArray;
};

const getRecentGamesBoxArt = async (recentGames) => {
    var requestParameters = "";
    var currentGameIncluded = false;

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
        //qs: { offset: '0', limit: '2' },
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

    console.log(response.headers["ratelimit-remaining"]);

    for (let game of response.data.data) {
        game.box_art_url = game.box_art_url.replace(/{width}/g, "200");
        game.box_art_url = game.box_art_url.replace(/{height}/g, "300");
        if (game.name.length > 25) game.name = game.name.substring(0, 23) + "..";
    }

    return response.data.data;
};

const parseData = (user, stream, recentGames) => {
    let streamer = {};
    streamer.name = user.login;
    streamer.display_name = user.display_name;
    streamer.logo = user.profile_image_url;
    streamer.preview = user.offline_image_url;
    streamer.recent_games = recentGames;
    if (stream) {
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
            viewers: stream.viewer_count,
            started_at: stream.started_at,
            title: stream.title,
            preview: stream.thumbnail_url,
        };
    }
    return streamer;
};

const isFollowingStreamer = async (username, streamer) => {
    let query = `SELECT follows.id as follow_id, games.id, games.name, games.box_art_url
                 FROM follows 
                 INNER JOIN users ON users.id = follows.user_id 
                 INNER JOIN streamers ON streamers.id = follows.streamer_id
                 LEFT JOIN followed_games ON followed_games.follow_id = follows.id 
                 LEFT JOIN games on games.id = followed_games.game_id
                 WHERE users.username = $1 AND streamers.name = $2`;
    let values = [username, streamer];
    let result = await db.query(query, values);

    let isFollowing = result.rows.length > 0;
    let followedGames = [];
    for (let game of result.rows) {
        delete game.follow_id;
        if (game.id) followedGames.push(game);
    }
    return { isFollowing, followedGames };
};
