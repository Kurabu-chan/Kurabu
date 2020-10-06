import * as bodyParser from 'body-parser';
import * as controllers from './controllers';
import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Server as Serve } from 'http'; 

class ExampleServer extends Server {

    private readonly SERVER_STARTED = 'Example server started on port: ';

    constructor() {
        super(true);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        /*this.app.use((req, res, next) => {
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

    private setupControllers(): void {
        const ctlrInstances = [];
        for (const name in controllers) {
            if (controllers.hasOwnProperty(name)) {
                const controller = (controllers as any)[name];
                ctlrInstances.push(new controller());
            }
        }
        super.addControllers(ctlrInstances);
    }

    public start(port: number): Serve {
        this.app.get('*', (req, res) => {
            res.send(this.SERVER_STARTED + port);
        });
        return this.app.listen(port, "0.0.0.0", () => {
            Logger.Imp(this.SERVER_STARTED + port);
        });
        
    }
}

export default ExampleServer;