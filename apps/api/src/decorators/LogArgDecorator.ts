/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from "express";

import { winstonLogger } from "@kurabu/logging";
import { getUUID } from "#helpers/randomCodes";

export default function logArg() {
    return function (target: any, key: string | symbol, descriptor: PropertyDescriptor): void {
        const original = descriptor.value;

        descriptor.value = function (req: Request, res: Response, arg: any = {}) {
            const requestCode = getUUID();

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { user, ...logArguments } = arg;

            winstonLogger.info(
                `${requestCode} ${target.constructor.name as string}: ${JSON.stringify(
                    logArguments,
                    null,
                    2
                )}`
            );
            const val = original.apply(this, [req, res, arg]);

            return val;
        };
    };
}
