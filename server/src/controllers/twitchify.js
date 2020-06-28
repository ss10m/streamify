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
    recentGames.add(channel.game.toLowerCase());
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

export const followStreamer = async (username, streamer_name, sendData, sendError) => {
    let { user, errorUser } = await getUserData(username, sendError);
    if (!user) return sendError({ err: errorUser });

    let { streamer, errorStreamer } = await getStreamerData(streamer_name, sendError);
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

export const getFollows = async (username, sendData, sendError) => {
    let query = `SELECT streamers.name, streamers.display_name, streamers.logo, follows.followed_at
                 FROM follows 
                 INNER JOIN users ON users.id = follows.user_id 
                 INNER JOIN streamers ON streamers.id = follows.streamer_id
                 WHERE users.username = $1`;
    let values = [username];
    let result = await db.query(query, values);

    for (let res of result.rows) {
        console.log(` => ${res.username} follows ${res.display_name} since ${res.followed_at}'`);
    }

    sendData(result.rows);
};

//getFollows("czelo");
/*
export const getChannelTest = (id) => {
    let options = {
        method: "get",
        url: "https://api.twitch.tv/helix/channels?broadcaster_id=" + id,
        headers: {
            "Client-ID": cred.clientId,
            Authorization: cred.auth,
        },
    };

    axios(options).then((response) => {
        if (response && response.status != "200") {
            console.log(response.status);
            return;
        }
        console.log("================================");
        console.log("getChannelTest");
        console.log(response.data);
    });
};

export const getUsersTest = async (id) => {
    let options = {
        method: "get",
        url: "https://api.twitch.tv/helix/users?login=" + id,
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
    //console.log("================================");
    //console.log("getUsersTest");
    //console.log(response.data.data[0]);
    return response.data.data[0];
};

export const getStreamsTest = async (id) => {
    let options = {
        method: "get",
        url: "https://api.twitch.tv/helix/streams?user_login=" + id,
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
    console.log("================================");
    console.log("getStreamsTest");
    console.log(response.data);
};

//getChannelTest(23161357);
//getUsersTest("lirik");
//getUsersTest("czelo22");
//getUsersTest("summit1g");
//getStreamsTest("lirik");
//getStreamsTest("summit1g");

//121059319, 163836275, 60056333, 51496027, 71092938
//summit - 26490481

*/
