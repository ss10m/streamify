import crypto from "crypto";

export const parseError = (err) => {
    if (err.isJoi) return err.details[0];
    return JSON.stringify(err, Object.getOwnPropertyNames(err));
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
