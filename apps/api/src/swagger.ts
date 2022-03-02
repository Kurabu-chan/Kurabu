import * as express from "express";
import { serve, setup } from "swagger-ui-express";
import redoc from "redoc-express";

export function apply(app: express.Express): void {
    app.use("/api-docs/swagger", serve, setup(undefined, {
        swaggerOptions: {
            url: "../../swagger/swagger.json"
        }
    }));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    app.use("/api-docs/redoc", redoc({
        specUrl: "../../swagger/swagger.json",
        title: "Kurabu api",
    }));
    app.use("/swagger", express.static("swagger"));
}
