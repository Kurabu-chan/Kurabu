import { Request, Response } from "express";
import { injectable } from "tsyringe";

import { Controller, Post } from "@overnightjs/core";
import { winstonLogger } from "@kurabu/logging";

import * as Options from "./RegisterJwtControllerOptions";
import { SUCCESS_STATUS } from "#helpers/GLOBALVARS";
import requestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import { param, ParamType } from "#decorators/ParamDecorator";
import { StartUserRegisterCommandHandler } from "#commands/Users/StartRegister/StartUserRegisterCommandHandler";
import { UserJwtQueryHandler } from "#queries/Users/Jwt/UserJwtQueryHandler";

@Controller(Options.controllerPath)
@injectable()
export class RegisterJwtController {
    private _startUserRegisterCommand: StartUserRegisterCommandHandler;
    constructor(
        startUserRegisterCommand: StartUserRegisterCommandHandler,
        private _userJwtQuery: UserJwtQueryHandler
    ) {
        this._startUserRegisterCommand = startUserRegisterCommand;
    }

    @Post(Options.controllerName)
    @requestHandlerDecorator()
    @param("email", ParamType.string, false)
    @param("pass", ParamType.string, false)
    private async post(req: Request, res: Response, arg: Options.Params) {
        winstonLogger.info(`Starting auth for ${req.ip}`);

        const result = await this._startUserRegisterCommand.handle({
            email: arg.email,
            password: arg.pass,
        });

        const jwt = await this._userJwtQuery.handle({
            uuid: result.uuid,
        });

        return {
            message: jwt.jwtToken,
            status: SUCCESS_STATUS,
        };
    }
}
