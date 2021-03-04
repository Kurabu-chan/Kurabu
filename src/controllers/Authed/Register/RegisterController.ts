import { Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';
import * as Options from "./RegisterControllerOptions";
import { SUCCESS_STATUS } from '../../../helpers/GLOBALVARS';
import { Param, ParamType } from '../../../decorators/ParamDecorator';
import { Logger } from '@overnightjs/logger';
import RequestHandlerDecorator from '../../../decorators/RequestHandlerDecorator';
import { injectable } from 'tsyringe';
import { StartUserRegisterCommandHandler } from '../../../commands/Users/StartRegister/StartUserRegisterCommandHandler';

@Controller(Options.ControllerPath)
@injectable()
export class RegisterController {
    private _startUserRegisterCommand: StartUserRegisterCommandHandler;
    constructor(
        startUserRegisterCommand: StartUserRegisterCommandHandler) {

        this._startUserRegisterCommand = startUserRegisterCommand;
    }

    @Post(Options.ControllerName)
    @Param("email", ParamType.string, false)
    @Param("pass", ParamType.string, false)
    @RequestHandlerDecorator()
    private async post(req: Request, res: Response, arg: Options.params) {
        Logger.Info(`Starting auth for ${req.ip}`);

        var result = await this._startUserRegisterCommand.handle({
            email: arg.email,
            password: arg.pass
        });

        return {
            status: SUCCESS_STATUS,
            message: result.uuid
        };
    }
}