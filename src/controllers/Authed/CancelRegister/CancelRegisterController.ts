import { Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';
import * as Options from "./CancelRegisterControllerOptions";
import { SUCCESS_STATUS } from '../../../helpers/GLOBALVARS';
import LogArg from '../../../decorators/LogArgDecorator';
import { Param, ParamType } from '../../../decorators/ParamDecorator';
import RequestHandlerDecorator from '../../../decorators/RequestHandlerDecorator';
import { injectable } from 'tsyringe';
import { CancelUserRegisterCommandHandler } from '../../../commands/Users/CancelRegister/CancelUserRegisterCommandHandler';

@Controller(Options.ControllerPath)
@injectable()
export class CancelRegisterController {
    private _cancelUserRegisterCommand: CancelUserRegisterCommandHandler;

    constructor(cancelUserRegisterCommand: CancelUserRegisterCommandHandler) {
        this._cancelUserRegisterCommand = cancelUserRegisterCommand;
    }

    @Post(Options.ControllerName)
    @RequestHandlerDecorator()
    @Param("uuid", ParamType.string, false)
    @LogArg()
    private async post(req: Request, res: Response, arg: Options.params) {
        await this._cancelUserRegisterCommand.handle({
            uuid: arg.uuid
        })

        return {
            status: SUCCESS_STATUS,
            message: "Register canceled successfully"
        };
    }
}