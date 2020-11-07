import * as cred from "../config/credentials.js";
import axios from "axios";

import { roundedToFixed } from "../util/helpers.js";

let topStreamers = { streamers: [], latestFetch: null };

export const getTopStreamers = async (cb) => {
    try {
        const timeSinceLatestFetch = (new Date() - topStreamers.latestFetch) / 1000;
        if (timeSinceLatestFetch > 300) {
            const updatedTopStreamers = await updateTopStreamers();
            if (!updatedTopStreamers) throw new Error();
            topStreamers = updatedTopStreamers;
        }

        cb({
            meta: {
                ok: true,
                message: "ok",
            },
            data: { streamers: topStreamers.streamers },
        });
    } catch (err) {
        cb({
            meta: {
                ok: false,
                message: "Internal Server Error",
            },
            data: {},
        });
    }
};

const updateTopStreamers = async () => {
    let streamers = await fetchTopStreamers();
    if (!streamers) return null;

    let user_ids = [];
    let game_ids = [];
    for (let streamer of streamers) {
        user_ids.push(streamer.user_id);
        game_ids.push(streamer.game_id);
    }

    const [idToChannel, idToGame] = await Promise.all([
        fetchChannels(user_ids),
        fetchGames(game_ids),
    ]);
    if (!idToChannel || !idToGame) return null;

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
            viewers = roundedToFixed(viewers, 1);
        }
        data.viewer_count = viewers;
        ret.push(data);
    }

    return { streamers: ret, latestFetch: new Date() };
};

const fetchTopStreamers = async () => {
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

    let response = await axios(options);
    if (response && response.status != "200") {
        return null;
    }
    return response.data.data;
};

const fetchChannels = async (ids) => {
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
        return null;
    }

    let dict = {};
    response.data.data.forEach((obj) => (dict[obj.id] = obj));
    return dict;
};

const fetchGames = async (ids) => {
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
        return null;
    }

    let dict = {};
    response.data.data.forEach((obj) => (dict[obj.id] = obj));
    return dict;
};
