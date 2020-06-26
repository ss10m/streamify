import * as cred from "../config/credentials.js";
import axios from "axios";

import db from "../config/db.js";

export const getTopStreamers = (cb) => {
    let options = {
        method: "get",
        url: "https://api.twitch.tv/helix/streams",
        headers: {
            "Client-ID": cred.clientId,
            Authorization: cred.auth,
        },
        params: {
            first: 20,
        },
    };

    axios(options).then(async (response) => {
        if (response && response.status != "200") {
            console.log(response.status);
            return;
        }

        let streamers = response.data.data;
        let user_ids = [];
        let game_ids = [];
        for (let streamer of streamers) {
            user_ids.push(streamer.user_id);
            game_ids.push(streamer.game_id);
        }

        let idToChannel = await getChannels(user_ids);
        let idToGame = await getGames(game_ids);

        let ret = [];
        for (let streamer of streamers) {
            let channel = idToChannel[streamer.user_id];
            let game = idToGame[streamer.game_id];

            let data = {};
            data.id = streamer.user_id;
            data.viewer_count = streamer.viewer_count;
            data.name = channel.login;
            data.display_name = channel.display_name;
            data.logo = channel.profile_image_url;

            if (data.display_name.length > 14) data.display_name = data.display_name.substring(0, 14) + "..";

            let gameName = "";
            if (game) {
                gameName = game.name;
                if (gameName.length > 28) {
                    gameName = gameName.substring(0, 28) + "..";
                } else if (gameName == "") {
                    gameName = "Nothing";
                }
            } else {
                gameName = "Nothing";
            }
            data.game = gameName;

            let viewers = streamer.viewer_count;

            if (streamer.viewer_count >= 1000) {
                viewers = roundedToFixed(viewers / 1000, 1);
                if (viewers % 1 == 0) viewers = parseInt(viewers);
                viewers = viewers.toString() + "K";
            }
            data.viewer_count = viewers;

            ret.push(data);
        }

        cb(ret);
    });
};

function roundedToFixed(_float, _digits) {
    var rounded = Math.pow(10, _digits);
    return (Math.round(_float * rounded) / rounded).toFixed(_digits);
}

export const getChannels = async (ids) => {
    let idParam = "?id=" + ids.join("&id=");

    let options = {
        method: "get",
        url: "https://api.twitch.tv/helix/users" + idParam,
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

    let dict = {};
    response.data.data.forEach((obj) => (dict[obj.id] = obj));
    return dict;
};

export const getGames = async (ids) => {
    let idParam = "?id=" + ids.join("&id=");

    let options = {
        method: "get",
        url: "https://api.twitch.tv/helix/games" + idParam,
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

    let dict = {};
    response.data.data.forEach((obj) => (dict[obj.id] = obj));
    return dict;
};

// NEW
export const getVideos = async () => {
    let options = {
        method: "get",
        url: "https://api.twitch.tv/helix/videos?user_id=26490481",
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

    console.log(response.data.data);
};

//getVideos();
/*
export const getRecent = async () => {
    var options = {
        method: "GET",
        url: "https://api.twitch.tv/kraken/videos/top",
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

    console.log(response.data);
};
*/

export const getChannel = async (username, cb) => {
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

    getRecent(response.data.data[0].id, cb);
};

export const getRecent = async (user_id, cb) => {
    var options = {
        method: "GET",
        url: "https://api.twitch.tv/kraken/channels/" + user_id + "/videos?broadcast_type=archive&limit=50",
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

    let channel = response.data.videos[0].channel;
    let videos = response.data.videos;

    var recentGames = new Set();
    for (let video of videos) {
        recentGames.add(video.game.toLowerCase());
    }

    let recentGamesArray = Array.from(recentGames);
    if (recentGamesArray.length == 0) {
        /*
        streamerData['recentGames'] = '[]';
        callback(streamerData);
        */
    } else {
        getRecentGamesBoxArt(recentGamesArray, channel, cb);
    }
};

//getRecent();

//121059319, 163836275, 60056333, 51496027, 71092938
//summit - 26490481

const getRecentGamesBoxArt = async (recentGames, channel, cb) => {
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
    }

    channel.recent_games = response.data.data;

    //console.log(channel);
    cb(channel);
};

//getChannel("summit1g");

export const getStreamer = (username, cb) => {
    console.log(username);
    getChannel(username, cb);
};

export const followStreamer = async (username, streamer_name) => {
    console.log(username, streamer_name);
    const query1 = "SELECT * FROM users WHERE username = $1";
    const values1 = [username];
    const result1 = await db.query(query1, values1);
    if (!result1.rows.length) throw new Error("User not found");
    let user = result1.rows[0];
    console.log(user);

    let query2 = "SELECT * FROM streamers WHERE name = $1";
    let values2 = [streamer_name];
    let result2 = await db.query(query2, values2);
    let streamer = null;
    if (!result2.rows.length) {
        let queryInsertStreamer = "INSERT INTO streamers(name, display_name, logo) VALUES($1, $2, $3) RETURNING *";
        let valuesInsert = [streamer_name, streamer_name, "no logo"];
        let result = await db.query(queryInsertStreamer, valuesInsert);
        streamer = result.rows[0];
    } else {
        streamer = result2.rows[0];
    }

    console.log(streamer);

    let followInsert = "INSERT INTO follows(user_id, streamer_id) VALUES($1, $2) RETURNING *";
    let valuesInsert = [user.id, streamer.id];
    let follow = await db.query(followInsert, valuesInsert);
    console.log(follow.rows);
};

const getFollows = async (username, streamer_name) => {
    let query = `SELECT follows.id, users.username, streamers.name 
                 FROM follows 
                 INNER JOIN users ON users.id = follows.user_id 
                 INNER JOIN streamers ON streamers.id = follows.streamer_id`;
    let values = [];
    let result = await db.query(query, values);

    for (let res of result.rows) {
        console.log(`${res.id} => ${res.username} follows ${res.name}`);
    }
};

getFollows();
