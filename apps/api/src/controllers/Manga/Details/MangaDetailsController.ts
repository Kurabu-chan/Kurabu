import { Request, Response } from "express";
import { injectable } from "tsyringe";
import { Controller, Get } from "@overnightjs/core";
import * as Options from "./MangaDetailsControllerOptions";
import logArg from "#decorators/LogArgDecorator";
import * as Param from "#decorators/ParamDecorator";
import requestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import state from "#decorators/StateDecorator";
import { extractFields, Fields } from "#helpers/BasicTypes";
import { MangaDetailsWebRequestHandler } from "#webreq/Manga/Details/MangaDetailsWebRequestHandler";

@Controller(Options.controllerPath)
@injectable()
export class MangaDetailsController {
    constructor(private _detailsWebRequest: MangaDetailsWebRequestHandler) {}

    @Get(Options.controllerName)
    @requestHandlerDecorator()
    @state()
    @Param.param("mangaid", Param.ParamType.int, false)
    @Param.param("fields", Param.ParamType.string, true)
    @logArg()
    private async get(req: Request, res: Response, arg: Options.Params) {
        arg.mangaid = arg.mangaid ? arg.mangaid : 1;

        let fields: Fields | undefined;
        if (arg.fields) {
            fields = extractFields(arg.fields).fields;
        }

        const result = await this._detailsWebRequest.handle({
            fields,
            mangaid: arg.mangaid,
            user: arg.user,
        });

        return result.manga;
    }
}
