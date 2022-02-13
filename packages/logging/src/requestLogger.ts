import {
    Request,
    Response,
    NextFunction
} from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
    var date = new Date();
    

    console.log(`[${date.toUTCString()}] ${req.method} ${req.originalUrl}`);
    next();
}