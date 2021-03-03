import { Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';
import * as Options from "./RegisterControllerOptions";
import { SUCCESS_STATUS, ERROR_STATUS } from '../../../helpers/GLOBALVARS';
import LogArg from '../../../decorators/LogArgDecorator';
import { UserManager } from '../../../helpers/UserManager';
import { Param, ParamType } from '../../../decorators/ParamDecorator';
import { Logger } from '@overnightjs/logger';
import RequestHandlerDecorator from '../../../decorators/RequestHandlerDecorator';
import { autoInjectable, injectable } from 'tsyringe';
import ContainerManager from '../../../helpers/ContainerManager';

@Controller(Options.ControllerPath)
@injectable()
export class RegisterController {
    private _userManager: UserManager;
    constructor(userManager: UserManager) {
        this._userManager = userManager;
    }

    @Post(Options.ControllerName)
    @Param("email", ParamType.string, false)
    @Param("pass", ParamType.string, false)
    @RequestHandlerDecorator()
    private async post(req: Request, res: Response, arg: Options.params) {
        var uuid = await this._userManager.StartRegister(arg.email, arg.pass)
        Logger.Info(`Starting auth for ${req.ip}`);

        return {
            status: SUCCESS_STATUS,
            message: uuid
        };
    }
}