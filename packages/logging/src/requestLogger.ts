import {
    Request,
    Response,
    NextFunction
} from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
    const date = new Date();

    // eslint-disable-next-line no-console
    console.log(`[${date.toUTCString()}] ${req.method} ${req.originalUrl}`);
    next();
}