import * as cred from "../config/credentials.js";
import axios from "axios";
import db from "../config/db.js";

export const getStreamer = async (username, cb) => {
    var options = {
        method: "GET",
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

    getRecentGames(response.data.data[0], cb);
};

const getRecentGames = async (user, cb) => {
    var options = {
        method: "GET",
        url: "https://api.twitch.tv/kraken/channels/" + user.id + "/videos?broadcast_type=archive&limit=50",
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

    user.logo = user.profile_image_url;
    //delete user.profile_image_url;
    let stream = await getStream(user.login);

    if (stream.length) {
        stream = stream[0];
        user.stream = {
            game: stream.game_id,
            viewers: stream.viewer_count,
            started_at: stream.started_at,
            title: stream.title,
            preview: stream.thumbnail_url,
        };
    }
    user.recent_games = [];

    if (response.data._total === 0) return cb(user);
    let channel = response.data.videos[0].channel;

    let videos = response.data.videos;

    var recentGames = new Set();
    recentGames.add(channel.game.toLowerCase());
    for (let video of videos) {
        recentGames.add(video.game.toLowerCase());
    }

    let recentGamesArray = Array.from(recentGames);
    if (recentGamesArray.length == 0) {
        cb(user);
    } else {
        getRecentGamesBoxArt(recentGamesArray, user, cb);
    }
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
    return response.data.data;
};

const getRecentGamesBoxArt = async (recentGames, user, cb) => {
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

    user.recent_games = response.data.data;
    cb(user);
};
