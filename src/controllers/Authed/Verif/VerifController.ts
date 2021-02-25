import { Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';
import * as Options from "./VerifControllerOptions";
import { SUCCESS_STATUS, ERROR_STATUS } from '../../../helpers/GLOBALVARS';
import LogArg from '../../../decorators/LogArgDecorator';
import { UserManager } from '../../../helpers/UserManager';
import { Param, ParamType } from '../../../decorators/ParamDecorator';
import ErrorHandlerDecorator from '../../../decorators/ErrorHandlerDecorator';

@Controller(Options.ControllerPath)
export class VerifController {
    @Post(Options.ControllerName)
    @Param("uuid", ParamType.string, false)
    @Param("code", ParamType.string, false)
    @Param("redirect", ParamType.string, true)
    @LogArg()
    @ErrorHandlerDecorator()
    private post(req: Request, res: Response, arg: Options.params) {
        let ourdomain = `${req.protocol}://${req.hostname}`;

        UserManager.GetInstance().DoVerif(arg.uuid, arg.code, ourdomain, arg.redirect).then((url) => {
            res.status(200).json({
                status: SUCCESS_STATUS,
                message: url
            });
        })
    }
}