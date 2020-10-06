import ExampleServer from './ExampleServer';
import { Logger } from '@overnightjs/logger';
import { reload } from './helpers/GLOBALVARS';
import { config } from 'dotenv';
import { Database } from './helpers/database/Database';
import * as MailHelper from './helpers/MailHelper';

config();
reload();

let PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

if (PORT === 3000) {
    Logger.Warn(`env port is ${process.env.PORT}`);
}
MailHelper.Setup();
Database.GetInstance();

const exampleServer = new ExampleServer();
const httpServe = exampleServer.start(PORT);
