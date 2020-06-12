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

    /*
    request(options, function (error, response, body) {
        if (response && response.statusCode != "200") {
            console.log(response.statusCode);
            return;
        }

        body = JSON.parse(body)["streams"];

        for ([key, stream] of Object.entries(body)) {
            console.log(key, stream);
            
            var streamerData = {};
            streamerData["name"] = stream["channel"]["name"];
            streamerData["display_name"] = stream["channel"]["display_name"];
            streamerData["viewers"] = stream["viewers"];
            var game = stream["game"];
            if (game.length > 20) {
                game = game.substring(0, 20) + "...";
            } else if (game == "") {
                game = "Nothing";
            }
            streamerData["game"] = game;
            streamerData["logo"] = stream["channel"]["logo"];

            topStreamers[key] = streamerData;
            
        }
    });
    */
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
