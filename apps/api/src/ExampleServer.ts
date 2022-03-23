import { Server as Serve } from "http";
import * as bodyParser from "body-parser";
import { Server } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";
import controllers from "./controllers/Controllers";
import { apply as swagger } from "./swagger";
class ExampleServer extends Server {
    private readonly serverStarted = "Example server started on port: ";

    constructor() {
        super(true);
        this.app.use(bodyParser.json());
        this.app.use(
            bodyParser.urlencoded({
                extended: true,
            })
        );
        this.app.disable("x-powered-by");
        swagger(this.app);

        /* this.app.use((req, res, next) => {
			if (process.env.NODE_ENV === 'production') {
				if (req.headers['x-forwarded-proto'] !== 'https')
					// the statement for performing our redirection
					return res.redirect('https://' + req.headers.host + req.url);
				else
					return next();
			} else
				return next();
		});*/
        this.setupControllers();
    }
    public start(port: number): Serve {
        this.app.get("*", (req, res) => {
            res.send(this.serverStarted + port.toString());
        });
        return this.app.listen(port, "0.0.0.0", () => {
            Logger.Imp(this.serverStarted + port.toString());
        });
    }

    private setupControllers(): void {
        super.addControllers(controllers);
    }
}

export default ExampleServer;
