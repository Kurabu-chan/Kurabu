CREATE TABLE users (
    id varchar(36) UNIQUE PRIMARY KEY NOT NULL,
    email varchar(320) UNIQUE NOT NULL,
    pass Text NOT NULL,
    token Text NOT NULL,
    refreshtoken Text NOT NULL
);