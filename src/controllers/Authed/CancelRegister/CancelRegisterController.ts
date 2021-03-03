import { Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';
import * as Options from "./CancelRegisterControllerOptions";
import { SUCCESS_STATUS, ERROR_STATUS } from '../../../helpers/GLOBALVARS';
import LogArg from '../../../decorators/LogArgDecorator';
import { UserManager } from '../../../helpers/UserManager';
import { Param, ParamType } from '../../../decorators/ParamDecorator';
import RequestHandlerDecorator from '../../../decorators/RequestHandlerDecorator';
import { autoInjectable } from 'tsyringe';

@Controller(Options.ControllerPath)
@autoInjectable()
export class CancelRegisterController {
    @Post(Options.ControllerName)
    @Param("uuid", ParamType.string, false)
    @LogArg()
    @RequestHandlerDecorator()
    private post(req: Request, res: Response, arg: Options.params) {
        UserManager
            .GetInstance()
            .CancelRegister(arg.uuid);
            
        return{
            status: SUCCESS_STATUS,
            message: "Register canceled successfully"
        };
    }
}