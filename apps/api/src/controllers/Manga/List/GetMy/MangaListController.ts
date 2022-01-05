import { Request, Response } from "express";
import { injectable } from "tsyringe";
import { Controller, Get } from "@overnightjs/core";
import * as Options from "./MangaListControllerOptions";
import logArg from "#decorators/LogArgDecorator";
import requestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import state from "#decorators/StateDecorator";

import { param, ParamType } from "#decorators/ParamDecorator";
import { extractFields, Fields } from "#helpers/BasicTypes";
import MalformedParameterError from "#errors/Parameter/MalformedParameterError";
import { GetMyUserMangaListWebRequestHandler } from "#webreq/Manga/List/GetMy/GetMyUserMangaListWebRequestHandler";

@Controller(Options.controllerPath)
@injectable()
export class MangaListController {
    constructor(private _listWebRequest: GetMyUserMangaListWebRequestHandler) {}

    @Get(Options.controllerName)
    @requestHandlerDecorator()
    @state()
    @param("status", ParamType.string, true)
    @param("sort", ParamType.string, true)
    @param("limit", ParamType.int, true)
    @param("offset", ParamType.int, true)
    @param("fields", ParamType.string, true)
    @logArg()
    private async get(req: Request, res: Response, arg: Options.Params) {
        if (arg.limit && arg.limit > 100) {
            arg.limit = 100;
        }

        const allowedStati = ["reading", "completed", "on_hold", "dropped", "plan_to_read"];
        if (arg.status !== undefined && !allowedStati.includes(arg.status)) {
            const msg = "status should be one of the following: " + allowedStati.join(", ");
            throw new MalformedParameterError(msg);
        }

        const allowedSort = [
            "list_score",
            "list_updated_at",
            "manga_title",
            "manga_start_date",
            "manga_id",
        ];
        if (arg.sort !== undefined && !allowedSort.includes(arg.sort)) {
            const msg = "sort should be one of the following: " + allowedSort.join(", ");
            throw new MalformedParameterError(msg);
        }

        let fields: Fields | undefined;
        if (arg.fields) {
            fields = extractFields(arg.fields).fields;
        }

        const status = arg.status as
            | "reading"
            | "completed"
            | "on_hold"
            | "dropped"
            | "plan_to_read"
            | undefined;
        const sort = arg.sort as
            | "list_score"
            | "list_updated_at"
            | "manga_title"
            | "manga_start_date"
            | "manga_id"
            | undefined;

        const result = await this._listWebRequest.handle({
            fields,
            limit: arg.limit,
            offset: arg.offset,
            sort,
            status,
            user: arg.user,
        });

        return result.status;
    }
}
