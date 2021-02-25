import { Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';
import * as Options from "./CancelRegisterControllerOptions";
import { SUCCESS_STATUS, ERROR_STATUS } from '../../../helpers/GLOBALVARS';
import LogArg from '../../../decorators/LogArgDecorator';
import { UserManager } from '../../../helpers/UserManager';
import { Param, ParamType } from '../../../decorators/ParamDecorator';

@Controller(Options.ControllerPath)
export class CancelRegisterController {
    @Post(Options.ControllerName)
    @Param("uuid", ParamType.string, false)
    @LogArg()
    private post(req: Request, res: Response, arg: Options.params) {
        let result = UserManager
            .GetInstance()
            .CancelRegister(arg.uuid);
            
        if(result){
            res.status(200).json({
                status: SUCCESS_STATUS,
                message: "Register canceled successfully"
            });
        }else{
            res.status(403).json({
                status: ERROR_STATUS,
                message: "There was a problem canceling registration"
            });
        }
    }
}