import { Request, Response } from "express";
import { injectable } from "tsyringe";
import { Controller, Post } from "@overnightjs/core";
import * as Options from "./LoginControllerOptions";
import { param, ParamType } from "#decorators/ParamDecorator";
import requestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import { SUCCESS_STATUS } from "#helpers/GLOBALVARS";
import { UserLoginQueryHandler } from "#queries/Users/Login/UserLoginQueryHandler";
import { UserStatus } from "#queries/Users/Status/UserStatusQueryHandler";

@Controller(Options.controllerPath)
@injectable()
export class LoginController {
    constructor(private _userLoginQuery: UserLoginQueryHandler) {}

    @Post(Options.controllerName)
    @requestHandlerDecorator()
    @param("email", ParamType.string, false)
    @param("pass", ParamType.string, false)
    private async post(req: Request, res: Response, arg: Options.Params) {
        const result = await this._userLoginQuery.handle({
            email: arg.email,
            password: arg.pass,
        });

        return {
            message: result.id,
            status: SUCCESS_STATUS,
            userStatus: UserStatus[result.status],
        };
    }
}
