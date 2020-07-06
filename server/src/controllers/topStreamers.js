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
            first: 30,
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
            data.game = game ? game.name : "Nothing";

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

function roundedToFixed(float, digits) {
    let rounded = Math.pow(10, digits);
    return (Math.round(float * rounded) / rounded).toFixed(digits);
}

const getChannels = async (ids) => {
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

const getGames = async (ids) => {
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
