import * as cred from "../config/credentials.js";
import axios from "axios";

import db from "../config/db.js";

const getChannelTest = (id) => {
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

const getUsersTest = async (id) => {
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
    console.log("================================");
    console.log("getUsersTest");
    console.log(response.data.data[0]);
};

const getStreamsTest = async (id) => {
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

console.log("123");
//getChannelTest(26490481);
//getUsersTest("summit1g");
//getStreamsTest("lirik");
