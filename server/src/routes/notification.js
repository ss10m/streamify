import express from "express";
import axios from "axios";

import * as cred from "../config/credentials.js";
import db from "../config/db.js";

const notificationRoutes = express.Router();

const getStreamsTest = async (ids) => {
    let params = "";
    ids.forEach((id) => (params += "&user_id=" + id));
    params = params.substr(1);
    params = "?" + params;

    let options = {
        method: "get",
        url: "https://api.twitch.tv/helix/streams" + params,
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
    console.log(response.headers["ratelimit-remaining"]);
    console.log("getStreamsTest");
    console.log(response.data);
};

//get ids of online users
let ids = [121059319, 163836275, 60056333, 51496027, 71092938];
//getStreamsTest(ids);

const getUserIds = async () => {
    let query = `SELECT *
                 FROM streamers`;
    let values = [];
    let result = await db.query(query, values);
    //if (!result.rows.length) return [];
    //return result.rows;
    console.log(result.rows);
};
//getUserIds();

export default notificationRoutes;
