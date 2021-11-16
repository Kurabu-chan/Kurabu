import * as express from "express";
import * as swagger from "swagger-express-ts";
import { version, name } from "../package.json";

const config: swagger.ISwaggerExpressOptions = {
    definition: {
        info: {
            title: name,
            version
        }
    }
};

export function apply(app: express.Express): void {
    app.use("/api-docs", express.static("swagger"));
    app.use("/api-docs/swagger/assets", express.static("node_modules/swagger-ui-dist"));
    // app.use(swagger.express(config));
}