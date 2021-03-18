import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import * as Options from "./LogControllerOptions";
import { SUCCESS_STATUS } from '../../../helpers/GLOBALVARS';
import LogArg from '../../../decorators/LogArgDecorator';
import { UserManager } from '../../../helpers/UserManager';
import ErrorHandlerDecorator from '../../../decorators/RequestHandlerDecorator';
import { injectable } from 'tsyringe';

@Controller(Options.ControllerPath)
@injectable()
export class LogController {
    private _userManager: UserManager;
    constructor(userManager: UserManager) {
        this._userManager = userManager;
    }

    @Get(Options.ControllerName)
    @ErrorHandlerDecorator()
    @LogArg()
    private get(req: Request, res: Response) {
        this._userManager.LogDict();
        return {
            status: SUCCESS_STATUS,
            message: "Logged succesfully"
        };
    }
}