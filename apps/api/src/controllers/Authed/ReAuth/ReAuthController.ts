import { Request, Response } from "express";
import { injectable } from "tsyringe";
import { Controller, Post } from "@overnightjs/core";
import * as Options from "./ReAuthControllerOptions";
import { ReAuthUserCommandHandler } from "#commands/Users/ReAuth/ReAuthUserCommandHandler";
import logArg from "#decorators/LogArgDecorator";
import { param, ParamType } from "#decorators/ParamDecorator";
import requestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import state from "#decorators/StateDecorator";
import { SUCCESS_STATUS } from "#helpers/GLOBALVARS";

@Controller(Options.controllerPath)
@injectable()
export class ReAuthController {
    constructor(private _reAuthCommand: ReAuthUserCommandHandler) {}

    @Post(Options.controllerName)
    @requestHandlerDecorator()
    @state()
    @param("redirect", ParamType.string, true)
    @logArg()
    private async post(req: Request, res: Response, arg: Options.Params) {
        const ourdomain = `${req.protocol}://${req.hostname}`;

        const result = await this._reAuthCommand.handle({
			isJwt: arg.isJwt,
            ourdomain,
            redirect: arg.redirect,
            user: arg.user,
			uuid: arg.state,
        });

        return {
            message: result.url,
            status: SUCCESS_STATUS,
        };
    }
}
