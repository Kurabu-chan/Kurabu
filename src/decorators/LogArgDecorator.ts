import { Request, Response } from 'express';
import { Logger } from '@overnightjs/logger';
import { getUUID } from "../helpers/randomCodes";


export default function LogArg() {
    return function (target: Object, key: string | symbol, descriptor: PropertyDescriptor) {
        const original = descriptor.value;

        descriptor.value = function (req: Request, res: Response, arg: any = {}) {

            const requestCode = getUUID()

            Logger.Info(`${requestCode} ${target.constructor.name}: ${JSON.stringify(arg, null, 2)}`);
            let val = original.apply(this, [req, res, arg]);

            return val;
        }
    }
}