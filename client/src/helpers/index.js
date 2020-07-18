export const dateDifference = (then, now) => {
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
