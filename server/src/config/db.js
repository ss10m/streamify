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
        //console.log(text);
        return pgPool.query(text, params, callback);
    },
};

const createUserTable = () => {
    let createTableQuery =
        "CREATE TABLE IF NOT EXISTS users(id serial, username varchar(20) primary key NOT NULL, email varchar(30) NOT NULL, salt text NOT NULL, hash text NOT NULL);";
    pgPool.query(createTableQuery, (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("done");
    });
};
