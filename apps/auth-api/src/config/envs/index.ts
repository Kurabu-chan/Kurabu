import dotenv from "dotenv";

export const envs = {
	...process.env,
	...dotenv.config().parsed
};
export const isProduction = process.env.NODE_ENV === "production";

export const databaseConnectionOptions = {
    database: process.env.DB_NAME ?? "authapi",
    host: process.env.DB_HOST ?? "localhost",
    password: process.env.DB_PASSWORD ?? "authapi",
    port: parseInt(process.env.DB_PORT ?? "5432", 10),
    user: process.env.DB_USER ?? "authapi",
};
