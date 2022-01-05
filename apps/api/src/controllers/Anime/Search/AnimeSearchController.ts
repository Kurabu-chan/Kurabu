import { Request, Response } from "express";
import { injectable } from "tsyringe";
import { Controller, Get } from "@overnightjs/core";
import * as Options from "./AnimeSearchControllerOptions";
import logArg from "#decorators/LogArgDecorator";
import * as Param from "#decorators/ParamDecorator";
import requestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import state from "#decorators/StateDecorator";
import { extractFields, Fields } from "#helpers/BasicTypes";
import { AnimeSearchWebRequestHandler } from "#webreq/Anime/Search/AnimeSearchWebRequestHandler";

@Controller(Options.controllerPath)
@injectable()
export class AnimeSearchController {
    constructor(private _searchWebRequest: AnimeSearchWebRequestHandler) {}

    @Get(Options.controllerName)
    @requestHandlerDecorator()
    @state()
    @Param.param("query", Param.ParamType.string, false)
    @Param.param("limit", Param.ParamType.int, true)
    @Param.param("offset", Param.ParamType.int, true)
    @Param.param("fields", Param.ParamType.string, true)
    @logArg()
    private async get(req: Request, res: Response, arg: Options.Params) {
        if (arg.limit && arg.limit > 100) {
            arg.limit = 100;
        }

        let fields: Fields | undefined;
        if (arg.fields !== undefined) {
            // console.log(fields);
            fields = extractFields(arg.fields).fields;
            // console.log(fields);
        }

        const result = await this._searchWebRequest.handle({
            fields,
            limit: arg.limit,
            offset: arg.offset,
            query: arg.query,
            user: arg.user,
        });

        return result.search;
    }
}
