import { handleError } from "#api/ErrorHandler";

export function requestErrorHandler(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args: any) {
        try {
            const res = original.apply(this, args);
            if (res instanceof Promise) {
                return new Promise((resolve, reject) => {
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