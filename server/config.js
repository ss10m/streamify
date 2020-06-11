export const {
    SESS_NAME = "sid",
    SESS_SECRET = "secret!session",
    SESS_LIFETIME = 1000 * 60 * 60 * 24 * 60, // 60 days
} = process.env;
