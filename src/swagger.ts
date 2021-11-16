import * as express from "express";

export function apply(app: express.Express): void {
    app.use("/api-docs", express.static("swagger"));
    app.use("/api-docs/swagger/assets", express.static("node_modules/swagger-ui-dist"));
}