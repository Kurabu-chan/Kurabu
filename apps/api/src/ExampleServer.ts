import { Server as Serve } from "http";
import { urlencoded as bpUrlencoded, json as bpJson } from "body-parser";
import { Server } from "@overnightjs/core";
import { Request, Response } from "express";
import { winstonLogger } from "@kurabu/logging";
import controllers from "./controllers/Controllers";
import { apply as swagger } from "./swagger";

class ExampleServer extends Server {
    private readonly serverStarted = "Example server started on port: ";

    constructor() {
        super(true);
		this.app.use(bpJson());
        this.app.use(
			bpUrlencoded({
                extended: true,
            })
        );
        this.app.disable("x-powered-by");
        swagger(this.app);
        this.setupControllers();
    }
    public start(port: number): Serve {
        this.app.get("*", (req: Request, res: Response) => {
            res.send(this.serverStarted + port.toString());
        });
        return this.app.listen(port, "0.0.0.0", () => {
			winstonLogger.info(this.serverStarted + port.toString());
        });
    }

    private setupControllers(): void {
        super.addControllers(controllers);
    }
}

export default ExampleServer;
