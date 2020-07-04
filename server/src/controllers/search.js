import * as cred from "../config/credentials.js";
import axios from "axios";

export const search = (data, sendData, sendError) => {
    if (data.type === "game") return searchGames(data, sendData, sendError);
    if (data.type === "user") return searchUsers(data, sendData, sendError);
};

const searchUsers = async (data, sendData, sendError) => {
    let options = {
        method: "get",
        url: "https://api.twitch.tv/helix/search/channels?query=" + data.query,
        headers: {
            "Client-ID": cred.clientId,
            Authorization: cred.auth,
        },
        params: {
            first: 5,
        },
    };

    let response;
    try {
        response = await axios(options);
    } catch (err) {
        return sendError({ message: "Something went wrong" });
    }

    if (response.status != "200") {
        return sendError({ message: "Something went wrong" });
    }

    sendData({ data: response.data.data });
};

const searchGames = async (data, sendData, sendError) => {
    console.log(data);

    let options = {
        method: "get",
        url: "https://api.twitch.tv/helix/search/categories?query=" + data.query,
        headers: {
            "Client-ID": cred.clientId,
            Authorization: cred.auth,
        },
        params: {
            first: 5,
        },
    };

    let response = await axios(options);
    console.log(response.data.data);
};
