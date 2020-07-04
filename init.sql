CREATE TABLE "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

CREATE TABLE "users" (
    "id" serial PRIMARY KEY,
    "username" VARCHAR(50) UNIQUE NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "salt" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "created_at" timestamp DEFAULT NOW()
);

CREATE TABLE "streamers" (
    "name" VARCHAR(50) PRIMARY KEY,
    "id" INTEGER UNIQUE NOT NULL,
    "display_name" VARCHAR(50) NOT NULL,
    "logo" VARCHAR NOT NULL,
    "offline_img" VARCHAR NOT NULL
);

CREATE TABLE "follows" (
    "id" serial UNIQUE,
    "user_id" INTEGER REFERENCES "users"("id"),
    "streamer_id" INTEGER REFERENCES "streamers"("id"),
    "followed_at" timestamp DEFAULT NOW(),
    PRIMARY KEY ("user_id", "streamer_id")
);

CREATE TABLE "games" (
	"id" INTEGER PRIMARY KEY,
	"name" VARCHAR(80) UNIQUE NOT NULL, 
	"box_art_url" VARCHAR NOT NULL
);

CREATE TABLE "followed_games" (
	"follow_id" INTEGER REFERENCES "follows"("id") ON DELETE CASCADE,
	"game_id" INTEGER REFERENCES "games"("id"),
	"followed_at" timestamp DEFAULT NOW(),
    PRIMARY KEY ("follow_id", "game_id")
);
