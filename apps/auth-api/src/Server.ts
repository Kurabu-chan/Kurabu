import { join } from "path";
import { Configuration, Inject } from "@tsed/di";
import { PlatformApplication } from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import "@tsed/ajv";
import "@tsed/swagger";
import { config } from "./config";
import * as manageApi from "./controllers/api/manage";
import * as authApi from "./controllers/api/auth";
import * as pages from "./controllers/pages";

@Configuration({
	...config,
	acceptMimes: ["application/json"],
	componentsScan: false,
	exclude: [
		"**/*.spec.ts"
	],
	httpPort: process.env.PORT || 8083,
	httpsPort: false, // CHANGE
	middlewares: [
		cors(),
		cookieParser(),
		compress({}),
		methodOverride(),
		bodyParser.json(),
		bodyParser.urlencoded({
			extended: true
		})],
	mount: {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		"/": [
			...Object.values(pages)
		],
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "/api/v1/auth": [
            ...Object.values(authApi)
        ],
		// eslint-disable-next-line @typescript-eslint/naming-convention
		"/api/v1/manage": [
            ...Object.values(manageApi)
        ],
	},
	swagger: [
		{
			path: "/doc",
			specVersion: "3.0.1"
		}
	],
	views: {
		extensions: {
			ejs: "ejs"
		},
		root: join(process.cwd(), "../views"),
	}
})
export class Server {
	@Inject()
	protected app?: PlatformApplication;

	@Configuration()
	protected settings?: Configuration;
}
