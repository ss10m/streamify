import Pool from "pg-pool";

export const pgPool = new Pool({
    host: "db",
    database: "twitchify",
    port: 5432,
    user: "twitchify",
    password: "pw",
});

export default {
    query: (text, params, callback) => {
        return pgPool.query(text, params, callback);
    },
};
