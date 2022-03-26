/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from "express";

export enum ParamPos {
    body,
    query,
    either,
}

export enum ParamType {
    int,
    string,
    number,
    object,
    boolean,
}

export function param(
    paramName: string,
    paramType: ParamType,
    optional: boolean,
    paramPos: ParamPos = ParamPos.either,
    callback: (
        req: Request,
        res: Response,
        arg: any,
        success: boolean
    ) => Promise<void> | void = () => {}
) {
    return function (target: unknown, key: string | symbol, descriptor: PropertyDescriptor): void {
        const original = descriptor.value;

        descriptor.value = function (req: Request, res: Response, arg: any = {}) {
            const query = req.query[paramName];
            const body = req.body[paramName];

            let val: any;

            if (paramPos === ParamPos.either) val = query ?? body;
            if (paramPos === ParamPos.body) val = body;
            if (paramPos === ParamPos.query) val = query;

            if (paramType === ParamType.boolean && (optional === false || val !== undefined)) {
                if (
                    val === true ||
                    val === 1 ||
                    (typeof val === "string" && val.toUpperCase() === "TRUE")
                ) {
                    arg[paramName] = true;
                } else if (
                    val === false ||
                    val === 0 ||
                    (typeof val === "string" && val.toUpperCase() === "FALSE")
                ) {
                    arg[paramName] = false;
                } else {
                    void callback(req, res, arg, false);
                    res.status(403).json({
                        message: `Boolean parameter ${paramName} was not a boolean`,
                        status: "error",
                    });
                    return;
                }
                void callback(req, res, arg, true);
                return original.apply(this, [req, res, arg]);
            }

            if (paramType === ParamType.object && (optional === true || val !== undefined)) {
                arg[paramName] = val;
                void callback(req, res, arg, true);
                return original.apply(this, [req, res, arg]);
            }

            val = val?.toString();

            if ((!val || val === "") && optional === true) {
                void callback(req, res, arg, true);
                return original.apply(this, [req, res, arg]);
            }

            if ((!val || val === "") && optional === false) {
                void callback(req, res, arg, false);
                res.status(403).json({
                    message: `Missing required parameter ${paramName}`,
                    status: "error",
                });
                return;
            }

            if (paramType === ParamType.int) {
                const parsedInt = parseInt(val as string, 10);
                if (isNaN(parsedInt)) {
                    void callback(req, res, arg, false);
                    res.status(403).json({
                        message: `Integer parameter, ${paramName}, was not an integer`,
                        status: "error",
                    });
                    return;
                }
                arg[paramName] = parsedInt;
                void callback(req, res, arg, true);
                return original.apply(this, [req, res, arg]);
            }

            if (paramType === ParamType.number) {
                const parsedFloat = parseFloat(val as string);
                if (isNaN(parsedFloat)) {
                    void callback(req, res, arg, false);
                    res.status(403).json({
                        message: `Number parameter, ${paramName}, was not a number`,
                        status: "error",
                    });
                    return;
                }
                arg[paramName] = parsedFloat;
                void callback(req, res, arg, true);
                return original.apply(this, [req, res, arg]);
            }

            arg[paramName] = val as string;
            void callback(req, res, arg, true);
            return original.apply(this, [req, res, arg]);
        };
    };
}
