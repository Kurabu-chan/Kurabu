/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { handleError } from "#api/ErrorHandler";

export function requestErrorHandler(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args: any) {
        try {
            const res = original.apply(this, args);
            if (res instanceof Promise) {
                return new Promise((resolve) => {
                    res.then(resolve).catch(caught);
                });
            }
            
            return res;
        } catch (err) {
            caught(err);
        }
    }
}

function caught(err: any) {
    if (err instanceof Response) {
        err.json().then((jsonRes) => {
            console.log(jsonRes);
            handleError(jsonRes);
        })
    } else {
        throw err;
    }
}