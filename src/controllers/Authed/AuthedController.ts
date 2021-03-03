import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import * as Options from "./AuthedControllerOptions";
import { UserManager } from '../../helpers/UserManager';
import { Param, ParamPos, ParamType } from '../../decorators/ParamDecorator';
import State from '../../decorators/StateDecorator';
import { Logger } from '@overnightjs/logger';
import RequestHandlerDecorator from '../../decorators/RequestHandlerDecorator';
import ParameterError from '../../errors/Parameter/ParameterError';
import {autoInjectable, injectable} from "tsyringe";
import ContainerManager from '../../helpers/ContainerManager';

@Controller(Options.ControllerPath)
@injectable()
export class AuthedController {
    private _userManager: UserManager;
    constructor(userManager: UserManager) {
        this._userManager = userManager;
    }
    
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

            this._userManager.SetErrored(arg.state);
            throw new ParameterError("There is a problem with one of your parameters");
        }

        let ourdomain = `${req.protocol}://${req.hostname}`;
        var redirUrl = await this._userManager.DoPending(arg.state, arg.code, ourdomain)

        res.redirect(redirUrl);        
    }

    private static ErrorCallback(req: Request, res: Response, arg: Options.params, success: boolean) {
        const userManager = ContainerManager.getInstance().Container.resolve(UserManager);

        if (!success) {
            userManager.SetCanceled(arg.state);
        }
    }

    private static CodeCallback(req: Request, res: Response, arg: Options.params, success: boolean) {
        const userManager = ContainerManager.getInstance().Container.resolve(UserManager);

        if (!success) {
            userManager.SetErrored(arg.state);
        }
    }
}