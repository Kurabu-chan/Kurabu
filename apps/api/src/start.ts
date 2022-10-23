import { winstonLogger, requestLogger } from "@kurabu/logging";


/* eslint-disable import/order */
import { config } from "dotenv";
config();
import { reload } from "./helpers/GLOBALVARS";
reload();
import { check } from "./env";
check();

if (process.env.NODE_ENV === "") {
	winstonLogger.defaultMeta = {
		service: "@kurabu/api"
	};
}

import ExampleServer from "./ExampleServer";
import ContainerManager from "./helpers/ContainerManager";

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 15000;

if (PORT === 15000) {
    winstonLogger.warn(`env port is ${process.env.PORT ?? "undefined"}`);
}

ContainerManager.getInstance();

const exampleServer = new ExampleServer();
exampleServer.app.use(requestLogger);
exampleServer.start(PORT);
