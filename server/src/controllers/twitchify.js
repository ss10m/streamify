import * as cred from "../config/credentials.js";
import axios from "axios";

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

            let gameName = game.name;
            if (gameName.length > 20) {
                gameName = gameName.substring(0, 20) + "...";
            } else if (gameName == "") {
                gameName = "Nothing";
            }
            data.game = gameName;

            ret.push(data);
        }

        cb(ret);
    });
};

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
    console.log(response.data.data);

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

export const getChannel = async (name) => {
    var options = {
        method: "GET",
        url: "https://api.twitch.tv/helix/users?login=" + name,
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

    getRecent(response.data.data[0].id);
};

export const getRecent = async (user_id) => {
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
        getRecentGamesBoxArt(recentGamesArray, channel);
    }
};

//getRecent();

//121059319, 163836275, 60056333, 51496027, 71092938
//summit - 26490481

const getRecentGamesBoxArt = async (recentGames, channel) => {
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

    console.log(channel);
};

getChannel("summit1g");
