CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");


CREATE TABLE "users" (
    "id" serial, 
    "username" varchar(20) primary key NOT NULL, 
    "email" varchar(30) NOT NULL, 
    "salt" text NOT NULL, 
    "hash" text NOT NULL
);