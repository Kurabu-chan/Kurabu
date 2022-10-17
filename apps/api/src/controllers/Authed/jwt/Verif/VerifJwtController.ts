import { Request, Response } from "express";
import { injectable } from "tsyringe";
import { Controller, Post } from "@overnightjs/core";
import * as Options from "./VerifJwtControllerOptions";
import { VerifUserCommandHandler } from "#commands/Users/Verif/VerifUserCommandHandler";
import logArg from "#decorators/LogArgDecorator";
import { param, ParamType } from "#decorators/ParamDecorator";
import requestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import { SUCCESS_STATUS } from "#helpers/GLOBALVARS";
import { stateFromJwtWithoutVerification } from "#decorators/StateDecorator";

@Controller(Options.controllerPath)
@injectable()
export class VerifJwtController {
    private _verifUserCommand: VerifUserCommandHandler;

    constructor(verifUserCommand: VerifUserCommandHandler) {
        this._verifUserCommand = verifUserCommand;
    }

    @Post(Options.controllerName)
    @requestHandlerDecorator()
    @stateFromJwtWithoutVerification("uuid")
    @param("code", ParamType.string, false)
    @param("redirect", ParamType.string, true)
    @logArg()
    private async post(req: Request, res: Response, arg: Options.Params) {
        const ourdomain = `${req.protocol}://${req.hostname}`;

        const result = await this._verifUserCommand.handle({
            code: arg.code,
			isJwt: true,
            ourdomain,
            redirect: arg.redirect,
			uuid: arg.uuid,
        });

        return {
            message: result.url,
            status: SUCCESS_STATUS,
        };
    }
}
