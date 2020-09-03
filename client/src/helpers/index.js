// Actions
const LOGIN = "LOGIN";
const FOLLOW_STREAMER = "FOLLOW_STREAMER";
const UNFOLLOW_STREAMER = "UNFOLLOW_STREAMER";
const FOLLOW_GAME = "FOLLOW_GAME";
const UNFOLLOW_GAME = "UNFOLLOW_GAME";

const dateDifference = (then, now) => {
    let offset = (now - then) / 1000;
    let delta_s = parseInt(offset % 60);
    offset /= 60;
    let delta_m = parseInt(offset % 60);
    offset /= 60;
    let delta_h = parseInt(offset % 24);
    offset /= 24;
    let delta_d = parseInt(offset);

    if (delta_d > 365) {
        let years = parseInt(delta_d / 365);
        let plural = years > 1 ? "s" : "";
        return `${years} year${plural} ago`;
    }
    if (delta_d > 30) {
        let months = parseInt(delta_d / 30);
        let plural = months > 1 ? "s" : "";
        return `${months} month${plural} ago`;
    }
    if (delta_d > 0) {
        let plural = delta_d > 1 ? "s" : "";
        return `${delta_d} day${plural} ago`;
    }
    if (delta_h > 0) {
        let plural = delta_h > 1 ? "s" : "";
        return `${delta_h} hour${plural} ago`;
    }
    if (delta_m > 0) {
        let plural = delta_m > 1 ? "s" : "";
        return `${delta_m} minute${plural} ago`;
    }
    if (delta_s > 10) {
        return `${delta_s} seconds ago`;
    } else {
        return "just now";
    }
};

const liveTime = (then, now) => {
    let offset = (now - then) / 1000;
    let delta_s = parseInt(offset % 60);
    offset /= 60;
    let delta_m = parseInt(offset % 60);
    offset /= 60;
    let delta_h = parseInt(offset % 24);

    if (delta_m < 10) delta_m = "0" + delta_m;
    if (delta_s < 10) delta_s = "0" + delta_s;

    return `${delta_h}:${delta_m}:${delta_s}`;
};

const parseResponse = async (response) => {
    try {
        return await response.json();
    } catch (err) {
        return null;
    }
};

export {
    LOGIN,
    FOLLOW_STREAMER,
    UNFOLLOW_STREAMER,
    FOLLOW_GAME,
    UNFOLLOW_GAME,
    dateDifference,
    liveTime,
    parseResponse,
};
