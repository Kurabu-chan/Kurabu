import { Client, QueryResult, QueryConfig } from 'pg';
import * as fs from 'fs';
import { singleton } from 'tsyringe';
import { Sequelize } from 'sequelize-typescript';
import ModelsArray, { ModelsType, Models } from "../models";

export type UserDatabaseEntry = {
    id: string,
    email: string
    token: string,
    refreshtoken: string
}

@singleton()
export class Database {
    private sequilize!: Sequelize;
    private models!: ModelsType;

    get Sequilize(){
        return this.sequilize;
    }

    get Models(){
        return this.models;
    }

    constructor(){
        this.models = Models;
        this.sequilize = new Sequelize(process.env.DATABASE_URL as string, {
            models: ModelsArray,
            dialect: "postgres",
            dialectOptions: {
                ssl: {
                    rejectUnauthorized: false, // very important
                }
            }
        });
        this.sequilize.sync();
        this.sequilize.databaseVersion().then((version)=> {
            console.log(`Database initialized with db version ${version}`);
        })
    }
}