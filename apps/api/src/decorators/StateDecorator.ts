/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import ContainerManager from "#helpers/ContainerManager";
import { CheckRequestStateQueryHandler } from "#queries/Request/CheckState/CheckRequestStateQueryHandler";
import MissingParameterError from "#errors/Parameter/MissingParameterError";
import MalformedParameterError from "#errors/Parameter/MalformedParameterError";
import { JWT_ENCRYPTION } from "#helpers/GLOBALVARS";

export default function state() {
    return function (target: any, key: string | symbol, descriptor: PropertyDescriptor): void {
        const original = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, arg: any = {}) {
            const container = ContainerManager.getInstance().container;
            const checkRequestStateQuery = container.resolve(CheckRequestStateQueryHandler);

            const userState = await checkRequestStateQuery.handle({ req, res });

            return original.apply(this, [
                req,
                res,
                {
                    ...arg,
                    state: userState.state,
                    user: userState.user,
                },
            ]);
        };
    };
}

export function stateFromJwtWithoutVerification(paramName = "state") {
    return function (target: any, key: string | symbol, descriptor: PropertyDescriptor): void {
        const original = descriptor.value;

        descriptor.value = function (req: Request, res: Response, arg: any = {}) {
            const authorization = req.headers.authorization;

            if (authorization === undefined) {
                throw new MissingParameterError("Authorization header not present");
            }

            if (!authorization.startsWith("Bearer ")) {
                throw new MalformedParameterError("Authorization header is malformed");
            }

            const jwtPart = authorization.split(" ")[1];
            const jwtToken = jwt.verify(jwtPart, JWT_ENCRYPTION) as any;

            arg[paramName] = jwtToken.id;
            return original.apply(this, [req, res, arg]);
        };
    };
}
