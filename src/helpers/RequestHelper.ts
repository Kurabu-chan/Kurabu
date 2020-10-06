import { Request, Response } from 'express';


export class BodyOrUrlParams {
    public static RequiredString(paramName: string,req: Request) : string {
        let param = req.query[paramName];
        let body = req.body[paramName];

        if (!param && !body) {
            throw new Error(`Missing parameter ${paramName}`);
        }

        if (param && param != "") {
            return (param as string);
        }

        if(body && body != "") {
            return (body as string);
        }

        throw new Error(`Parameter ${paramName} is empty`);        
    }

    public static OptionalString(paramName: string,req: Request) : string | undefined {
        let param = req.query[paramName];
        let body = req.body[paramName];

        if (param && param != "") {
            return (param as string);
        }

        if (body && body != "") {
            return (body as string);
        }

        return undefined;
    }

    public static OptionalInt(paramName: string,req: Request) : number | undefined {
        let val = this.OptionalString(paramName, req);
        if (val) {
            try {
                return parseInt(val);
            } catch (e) { }
        }

        return undefined
    }

    public static RequiredInt(paramName: string,req: Request) : number {
        let val = this.RequiredString(paramName, req);
        
        try {
            return parseInt(val);
        } catch (e) {
            throw new Error(`Parameter ${paramName} is not an int`);
        }
    }
}