import { createLogger, format, transports } from "winston";

export const logger = createLogger({
	exceptionHandlers: [
		new transports.Console()
	],
	format: format.simple(),
	level: "info",
	transports: [
		new transports.Console()
	],
});
