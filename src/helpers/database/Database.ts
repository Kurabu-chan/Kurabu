import { Client, QueryResult, QueryConfig } from 'pg';
import * as fs from 'fs';
import * as hasher from '../../helpers/Hasher';

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
            let res = await this.QueryFile("src/elpers/atabase/ueries/ableSetup.sql");
        }        
    }

    /** Create A user in the database */
    public async CreateUser(uuid: string, email: string, password: string, token: string, refreshToken: string) {
        let query = "INSERT INTO users VALUES ($1,$2,$3,$4,$5)";

        //hash password
        let hash = await hasher.hash(password);

        let values = [uuid, email, hash, token, refreshToken];
        this.ParamQuery(query, values);
        console.log("Inserted new user into database");
    }

    /** get a user by his/her login info */
    public async GetUserLogin(email: string, password: string) {
        let query = "SELECT * FROM users WHERE EMail = $1;"
        let res = await this.ParamQuery(query, [email]);

        //user doesn't exist
        if (res.rowCount === 0) throw new Error("Incorrect login");
        
        let entry = res.rows[0];
        if (!hasher.Verify(password, entry.pass)) throw new Error("Incorrect login");

        return {
            id: entry.id,
            email: entry.email,
            token: entry.email,
            refreshtoken: entry.refreshtoken
        }
    }

    /** get a user by his/her id */
    public async GetUserUUID(uuid: string) : Promise<UserDatabaseEntry> {
        let query = "SELECT * FROM users WHERE id = $1;";
        let res = await this.ParamQuery(query, [uuid]);

        if (res.rowCount === 0) throw new Error("User doesn't exist");
        
        let entry = res.rows[0];        
        return {
            id: entry.id,
            email: entry.email,
            token: entry.email,
            refreshtoken: entry.refreshtoken
        }
    }

    public async UpdateTokens(uuid: string, token: string, refreshtoken: string) {
        let res = await this.ParamQuery("UPDATE users SET token=$1, refreshtoken=$2 WHERE id=$3", [token, refreshtoken, uuid]);
    }

    public async GetEmailUsed(email: string): Promise<boolean> {
        let res = await this.ParamQuery("SELECT COUNT(*) FROM users WHERE email = $1;", [email]);
        let row: {count: number} = res.rows[0];
        return row.count != 0;
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

    public async ParamQuery(query: string,values: any[]) : Promise<QueryResult<any>> {
        return await this.client.query(query,values);
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