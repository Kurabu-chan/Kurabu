import { Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';
import * as Options from "./CancelRegisterControllerOptions";
import { SUCCESS_STATUS, ERROR_STATUS } from '../../../helpers/GLOBALVARS';
import LogArg from '../../../decorators/LogArgDecorator';
import { UserManager } from '../../../helpers/UserManager';
import { Param, ParamType } from '../../../decorators/ParamDecorator';
import RequestHandlerDecorator from '../../../decorators/RequestHandlerDecorator';
import { autoInjectable, injectable } from 'tsyringe';
import ContainerManager from '../../../helpers/ContainerManager';

@Controller(Options.ControllerPath)
@injectable()
export class CancelRegisterController {
    private _userManager: UserManager;
    constructor(userManager: UserManager) {
        this._userManager = userManager;
    }

    @Post(Options.ControllerName)
    @Param("uuid", ParamType.string, false)
    @LogArg()
    @RequestHandlerDecorator()
    private post(req: Request, res: Response, arg: Options.params) {
        this._userManager.CancelRegister(arg.uuid);

        return {
            status: SUCCESS_STATUS,
            message: "Register canceled successfully"
        };
    }
}