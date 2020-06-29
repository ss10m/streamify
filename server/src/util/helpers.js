import crypto from "crypto";

export const parseError = (err) => {
    let message = "";
    if (err.isJoi) {
        message = err.details[0].message;
    } else {
        message = err.message;
    }
    if (!message) message = "Something went wrong";
    console.log(message);
    return JSON.stringify({ message });
};

export const sessionizeUser = (user) => {
    return { username: user.username, last_login: new Date() };
};

export const encryptPassword = (password) => {
    let salt = crypto.randomBytes(16).toString("hex");
    let hash = crypto.pbkdf2Sync(password, salt, 10000, 512, "sha512").toString("hex");
    return { salt, hash };
};

export const verifyPassword = (user, password) => {
    const hash = crypto.pbkdf2Sync(password, user.salt, 10000, 512, "sha512").toString("hex");
    return user.hash === hash;
};
