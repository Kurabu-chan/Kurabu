import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import * as Options from "./LogControllerOptions";
import { SUCCESS_STATUS } from '../../../helpers/GLOBALVARS';
import LogArg from '../../../decorators/LogArgDecorator';
import { UserManager } from '../../../helpers/UserManager';
import ErrorHandlerDecorator from '../../../decorators/RequestHandlerDecorator';
import { autoInjectable } from 'tsyringe';

@Controller(Options.ControllerPath)
@autoInjectable()
export class LogController {
    @Get(Options.ControllerName)
    @LogArg()
    @ErrorHandlerDecorator()
    private get(req: Request, res: Response){
        UserManager.GetInstance().LogDict();
        return{
            status: SUCCESS_STATUS,
            message: "Logged succesfully"
        };
    }
}