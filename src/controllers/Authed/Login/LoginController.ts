import { Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';
import * as Options from "./LoginControllerOptions";
import { SUCCESS_STATUS, ERROR_STATUS } from '../../../helpers/GLOBALVARS';
import { UserManager } from '../../../helpers/UserManager';
import { Param, ParamType } from '../../../decorators/ParamDecorator';

@Controller(Options.ControllerPath)
export class LoginController {
    @Post(Options.ControllerName)
    @Param("email", ParamType.string, false)
    @Param("pass", ParamType.string, false)
    private post(req: Request, res: Response, arg: Options.params) {
        UserManager.GetInstance().Login(arg.email, arg.pass).then((result) => {
            res.status(200).json({
                status: SUCCESS_STATUS,
                message: result
            });
        }).catch((e) => {
            res.status(403).json({
                status: ERROR_STATUS,
                message: e.message
            });
        });
    }
}