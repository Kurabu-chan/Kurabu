import { Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';
import * as Options from "./RegisterControllerOptions";
import { SUCCESS_STATUS, ERROR_STATUS } from '../../../helpers/GLOBALVARS';
import LogArg from '../../../decorators/LogArgDecorator';
import { UserManager } from '../../../helpers/UserManager';
import { Param, ParamType } from '../../../decorators/ParamDecorator';
import { Logger } from '@overnightjs/logger';
import ErrorHandlerDecorator from '../../../decorators/ErrorHandlerDecorator';

@Controller(Options.ControllerPath)
export class RegisterController {
    @Post(Options.ControllerName)
    @Param("email", ParamType.string, false)
    @Param("pass", ParamType.string, false)
    @ErrorHandlerDecorator()
    private post(req: Request, res: Response, arg: Options.params) {
        UserManager.GetInstance().StartRegister(arg.email, arg.pass).then((uuid) => {
            //log that we are starting an auth for an ip with the state
            Logger.Info(`Starting auth for ${req.ip}`);
            //send the uuid to the user
            res.status(200).json({
                status: SUCCESS_STATUS,
                message: uuid
            });
        });
    }
}