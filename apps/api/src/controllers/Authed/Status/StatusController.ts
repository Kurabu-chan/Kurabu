import { Request, Response } from "express";
import { injectable } from "tsyringe";
import { Controller, Get } from "@overnightjs/core";
import * as Options from "./StatusControllerOptions";
import logArg from "#decorators/LogArgDecorator";
import requestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import state from "#decorators/StateDecorator";
import { SUCCESS_STATUS } from "#helpers/GLOBALVARS";
import { UserStatus, UserStatusQueryHandler } from "#queries/Users/Status/UserStatusQueryHandler";

@Controller(Options.controllerPath)
@injectable()
export class StatusController {
    constructor(private _userStatusQuery: UserStatusQueryHandler) {}

    @Get(Options.controllerName)
    @requestHandlerDecorator()
    @state()
    @logArg()
    private async get(req: Request, res: Response, arg: Options.Params) {
        const result = await this._userStatusQuery.handle({
            user: arg.user,
        });

        return {
            message: UserStatus[result.status],
            status: SUCCESS_STATUS,
        };
    }
}
