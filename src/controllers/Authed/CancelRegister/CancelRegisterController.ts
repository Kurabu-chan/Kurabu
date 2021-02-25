import { Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';
import * as Options from "./CancelRegisterControllerOptions";
import { SUCCESS_STATUS, ERROR_STATUS } from '../../../helpers/GLOBALVARS';
import LogArg from '../../../decorators/LogArgDecorator';
import { UserManager } from '../../../helpers/UserManager';
import { Param, ParamType } from '../../../decorators/ParamDecorator';
import ErrorHandlerDecorator from '../../../decorators/ErrorHandlerDecorator';

@Controller(Options.ControllerPath)
export class CancelRegisterController {
    @Post(Options.ControllerName)
    @Param("uuid", ParamType.string, false)
    @LogArg()
    @ErrorHandlerDecorator()
    private post(req: Request, res: Response, arg: Options.params) {
        UserManager
            .GetInstance()
            .CancelRegister(arg.uuid);
            
        res.status(200).json({
            status: SUCCESS_STATUS,
            message: "Register canceled successfully"
        });
    }
}