import { Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';
import * as Options from "./LoginControllerOptions";
import { SUCCESS_STATUS, ERROR_STATUS } from '../../../helpers/GLOBALVARS';
import { UserManager } from '../../../helpers/UserManager';
import { Param, ParamType } from '../../../decorators/ParamDecorator';
import RequestHandlerDecorator from '../../../decorators/RequestHandlerDecorator';
import { autoInjectable, injectable } from 'tsyringe';
import ContainerManager from '../../../helpers/ContainerManager';

@Controller(Options.ControllerPath)
@injectable()
export class LoginController {
    private _userManager: UserManager;
    constructor(userManager: UserManager) {
        this._userManager = userManager;
    }

    @Post(Options.ControllerName)
    @Param("email", ParamType.string, false)
    @Param("pass", ParamType.string, false)
    @RequestHandlerDecorator()
    private async post(req: Request, res: Response, arg: Options.params) {
        var result = await this._userManager.Login(arg.email, arg.pass)
        
        return {
            status: SUCCESS_STATUS,
            message: result
        };
    }
}