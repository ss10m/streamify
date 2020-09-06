import crypto from "crypto";

export const parseError = (err) => {
    let message = "";
    if (err.isJoi) {
        message = err.details[0].message;
    } else {
        message = "Internal Server Error";
    }
    return message;
};

export const sessionizeUser = (user) => {
    return { id: user.id, username: user.username, last_login: new Date() };
};

export const encryptPassword = (password) => {
    let salt = crypto.randomBytes(16).toString("hex");
    let hash = crypto
        .pbkdf2Sync(password, salt, 10000, 512, "sha512")
        .toString("hex");
    return { salt, hash };
};

export const verifyPassword = (user, password) => {
    const hash = crypto
        .pbkdf2Sync(password, user.salt, 10000, 512, "sha512")
        .toString("hex");
    return user.hash === hash;
};

export const roundedToFixed = (number, digits) => {
    if (number < 1000) return number;
    let float = number / 1000;
    let rounded = Math.pow(10, digits);
    let viewers = (Math.round(float * rounded) / rounded).toFixed(digits);
    if (viewers % 1 == 0) viewers = parseInt(viewers);
    return viewers + "K";
};
