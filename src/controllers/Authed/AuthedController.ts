import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import * as Options from "./AuthedControllerOptions";
import { UserManager } from '../../helpers/UserManager';
import { Param, ParamPos, ParamType } from '../../decorators/ParamDecorator';
import State from '../../decorators/StateDecorator';
import { Logger } from '@overnightjs/logger';
import RequestHandlerDecorator from '../../decorators/RequestHandlerDecorator';
import ParameterError from '../../errors/Parameter/ParameterError';

@Controller(Options.ControllerPath)
export class AuthedController {
    @Get(Options.ControllerName)
    @State()
    @Param("error", ParamType.string, true, ParamPos.either, AuthedController.ErrorCallback)
    @Param("code", ParamType.string, false, ParamPos.either, AuthedController.CodeCallback)
    @RequestHandlerDecorator()
    private async get(req: Request, res: Response, arg: Options.params) {
        const codeRe = /[0-9a-z]{700,1300}/
        //code wrong format
        if (!arg.code.match(codeRe)) {
            Logger.Warn("Code parameter was of incorrect format in request to /authed");

            UserManager.GetInstance().SetErrored(arg.state);
            throw new ParameterError("There is a problem with one of your parameters");
        }

        let ourdomain = `${req.protocol}://${req.hostname}`;
        var redirUrl = await UserManager.GetInstance().DoPending(arg.state, arg.code, ourdomain)

        res.redirect(redirUrl);        
    }

    private static ErrorCallback(req: Request, res: Response, arg: Options.params, success: boolean) {
        if (!success) {
            UserManager.GetInstance().SetCanceled(arg.state);
        }
    }

    private static CodeCallback(req: Request, res: Response, arg: Options.params, success: boolean) {
        if (!success) {
            UserManager.GetInstance().SetErrored(arg.state);
        }
    }
}