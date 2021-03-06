/* eslint-disable import/order */
import { config } from "dotenv";
config();
import { reload } from "./helpers/GLOBALVARS";
reload();
import { check } from "./env";
check();

import ExampleServer from "./ExampleServer";
import { Logger } from "@overnightjs/logger";
import ContainerManager from "./helpers/ContainerManager";
import { requestLogger } from "@kurabu/logging";

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 15000;

if (PORT === 15000) {
    Logger.Warn(`env port is ${process.env.PORT ?? "undefined"}`);
}

ContainerManager.getInstance();

const exampleServer = new ExampleServer();
exampleServer.app.use(requestLogger);
exampleServer.start(PORT);
