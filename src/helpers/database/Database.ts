import { Client, QueryResult, QueryConfig } from 'pg';
import * as fs from 'fs';

export type UserDatabaseEntry = {
    id: string,
    email: string
    token: string,
    refreshtoken: string
}

/** Class that handles all database related stuff */
export class Database {
    private static instance: Database;
    private client: Client;

    /** Initialize the database and make sure all the tables are there  */
    private constructor() {
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL env variable not set, api can't run without");
        }
        this.client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });

        this.client.connect();
        this.SetupDatabase();
    }

    /** Make sure the database has all the required tables */
    private async SetupDatabase() {
        let res = await this.Query("SELECT EXISTS ( SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users');");
        let exists = res.rows[0].exists;
        if (!exists) {
            //run setup file
            let res = await this.QueryFile("src/helpers/database/Queries/TableSetup.sql");
        }
    }

    /** Run a file as an sql query */
    public async QueryFile(path: string): Promise<QueryResult<any>> {
        if (fs.existsSync(path)) {
            let file = fs.readFileSync(path).toString();
            let res = await this.Query(file);
            return res;
        } else {
            throw new Error("File doesn't exist");
        }
    }

    public async ParamQuery(query: string, values: any[]): Promise<QueryResult<any>> {
        return await this.client.query(query, values);
    }

    /** Run an SQL query */
    public async Query(queryTextOrConfig: string | QueryConfig<any[]>): Promise<QueryResult<any>> {
        return await this.client.query(queryTextOrConfig);
    }

    /** Get the Database instance */
    public static GetInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}