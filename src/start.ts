import { config } from 'dotenv';
config();
import { reload } from './helpers/GLOBALVARS';
reload();

import ExampleServer from './ExampleServer';
import { Logger } from '@overnightjs/logger';
import ContainerManager from './helpers/ContainerManager';

let PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 15000;

if (PORT === 15000) {
    Logger.Warn(`env port is ${process.env.PORT}`);
}

ContainerManager.getInstance();

const exampleServer = new ExampleServer();
const httpServe = exampleServer.start(PORT);
