import { Request, Response } from 'express';

export enum ParamPos {
    body,
    query,
    either
}

export enum ParamType {
    int,
    string,
    number,
    object
}

export function Param(paramName: string, paramType: ParamType, optional: boolean, paramPos: ParamPos = ParamPos.either, callback: (req: Request, res: Response, arg: any, success: boolean) => void = () => { }) {
    return function (target: Object, key: string | symbol, descriptor: PropertyDescriptor) {
        const original = descriptor.value;

        descriptor.value = function (req: Request, res: Response, arg: any = {}) {
            let query = req.query[paramName]?.toString();
            let body = req.body[paramName]?.toString();

            let val: any;

            if (paramPos == ParamPos.either) val = query ?? body;
            if (paramPos == ParamPos.body) val = body;
            if (paramPos == ParamPos.query) val = query;

            if ((!val || val == "") && optional == false) {
                callback(req, res, arg, false);
                res.status(403).json({
                    status: "error",
                    message: `Missing required parameter ${paramName}`
                });
                return;
            }

            if (paramType == ParamType.object) original.apply(this, [req, res, { ...arg, paramName: val }]);
            val = val as string;
            if (paramType == ParamType.int) {
                var int = parseInt(val)
                if (int == NaN) {
                    callback(req, res, arg, false);
                    res.status(403).json({
                        status: "error",
                        message: `Integer parameter, ${paramName}, was not an integer`
                    });
                    return;
                }
                arg[paramName] = int;
                callback(req, res, arg, true);
                return original.apply(this, [req, res, arg]);
            }

            if (paramType == ParamType.number) {
                var float = parseFloat(val)
                if (float == NaN) {
                    callback(req, res, arg, false);
                    res.status(403).json({
                        status: "error",
                        message: `Number parameter, ${paramName}, was not a number`
                    });
                    return;
                }
                arg[paramName] = float;
                callback(req, res, arg, true);
                return original.apply(this, [req, res, arg]);
            }

            arg[paramName] = val as string;
            callback(req, res, arg, true);
            return original.apply(this, [req, res, arg]);
        }
    }
}