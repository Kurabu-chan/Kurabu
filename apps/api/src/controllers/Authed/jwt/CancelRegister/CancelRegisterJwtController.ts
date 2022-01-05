import { Request, Response } from "express";
import { injectable } from "tsyringe";
import { Controller, Post } from "@overnightjs/core";
import * as Options from "./CancelRegisterJwtControllerOptions";
import { CancelUserRegisterCommandHandler } from "#commands/Users/CancelRegister/CancelUserRegisterCommandHandler";
import logArg from "#decorators/LogArgDecorator";
import requestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import { SUCCESS_STATUS } from "#helpers/GLOBALVARS";
import { stateFromJwtWithoutVerification } from "#decorators/StateDecorator";

@Controller(Options.controllerPath)
@injectable()
export class CancelRegisterJwtController {
    private _cancelUserRegisterCommand: CancelUserRegisterCommandHandler;

    constructor(cancelUserRegisterCommand: CancelUserRegisterCommandHandler) {
        this._cancelUserRegisterCommand = cancelUserRegisterCommand;
    }

    @Post(Options.controllerName)
    @requestHandlerDecorator()
    @stateFromJwtWithoutVerification("uuid")
    @logArg()
    private async post(req: Request, res: Response, arg: Options.Params) {
        await this._cancelUserRegisterCommand.handle({
            state: arg.uuid,
        });

        return {
            message: "Register canceled successfully",
            status: SUCCESS_STATUS,
        };
    }
}
