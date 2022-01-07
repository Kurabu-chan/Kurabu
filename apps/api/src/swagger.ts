import * as express from "express";
import { serve, setup } from "swagger-ui-express";

export function apply(app: express.Express): void {
    app.use("/api-docs", serve, setup(undefined, {
        swaggerOptions: {
            url: "/swagger/swagger.json"
        }
    }));
    app.use("/swagger", express.static("swagger"));
}
