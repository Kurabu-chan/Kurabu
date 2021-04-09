import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import * as Options from "./AuthedControllerOptions";
import { Param, ParamPos, ParamType } from '../../decorators/ParamDecorator';
import State from '../../decorators/StateDecorator';
import { Logger } from '@overnightjs/logger';
import RequestHandlerDecorator from '../../decorators/RequestHandlerDecorator';
import ParameterError from '../../errors/Parameter/ParameterError';
import { injectable } from "tsyringe";
import { PendingUserCommandHandler } from '../../commands/Users/Pending/PendingUserCommandHandler';

@Controller(Options.ControllerPath)
@injectable()
export class AuthedController {
    constructor(
        private _pendingUserCommand: PendingUserCommandHandler) {
    }

    @Get(Options.ControllerName)
    @RequestHandlerDecorator()
    @State()
    @Param("error", ParamType.string, true, ParamPos.either, AuthedController.ErrorCallback)
    @Param("code", ParamType.string, false, ParamPos.either, AuthedController.CodeCallback)
    private async get(req: Request, res: Response, arg: Options.params) {
        const codeRe = /[0-9a-z]{700,1300}/
        if (!arg.code.match(codeRe)) {
            Logger.Warn("Code parameter was of incorrect format in request to /authed");

            arg.user.destroy();
            throw new ParameterError("There is a problem with one of your parameters");
        }

        let ourdomain = `${req.protocol}://${req.hostname}`;
        var result = await this._pendingUserCommand.handle({
            code: arg.code,
            ourdomain: ourdomain,
            uuid: arg.state
        });

        res.redirect(result.url);
    }

    private static ErrorCallback(req: Request, res: Response, arg: Options.params, success: boolean) {
        if(!success){
            arg.user.destroy();
        }
    }

    private static CodeCallback(req: Request, res: Response, arg: Options.params, success: boolean) {
        if(!success){
            arg.user.destroy();
        }
    }
}