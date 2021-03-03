import { Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';
import * as Options from "./VerifControllerOptions";
import { SUCCESS_STATUS, ERROR_STATUS } from '../../../helpers/GLOBALVARS';
import LogArg from '../../../decorators/LogArgDecorator';
import { UserManager } from '../../../helpers/UserManager';
import { Param, ParamType } from '../../../decorators/ParamDecorator';
import RequestHandlerDecorator from '../../../decorators/RequestHandlerDecorator';
import { autoInjectable } from 'tsyringe';

@Controller(Options.ControllerPath)
@autoInjectable()
export class VerifController {
    @Post(Options.ControllerName)
    @Param("uuid", ParamType.string, false)
    @Param("code", ParamType.string, false)
    @Param("redirect", ParamType.string, true)
    @LogArg()
    @RequestHandlerDecorator()
    private async post(req: Request, res: Response, arg: Options.params) {
        let ourdomain = `${req.protocol}://${req.hostname}`;

        var url = await UserManager.GetInstance().DoVerif(arg.uuid, arg.code, ourdomain, arg.redirect)
        return {
            status: SUCCESS_STATUS,
            message: url
        };
    }
}