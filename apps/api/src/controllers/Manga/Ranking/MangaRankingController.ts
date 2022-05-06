import { Request, Response } from "express";
import { injectable } from "tsyringe";
import { Controller, Get } from "@overnightjs/core";
import * as Options from "./MangaRankingControllerOptions";
import logArg from "#decorators/LogArgDecorator";
import * as Param from "#decorators/ParamDecorator";
import requestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import state from "#decorators/StateDecorator";
import { extractFields, Fields } from "#helpers/BasicTypes";
import { MangaRankingWebRequestHandler } from "#webreq/Manga/Ranking/MangaRankingWebRequestHandler";

const possible = [
    "all",
    "airing",
    "upcoming",
    "tv",
    "ova",
    "movie",
    "special",
    "bypopularity",
    "favorite",
];

@Controller(Options.controllerPath)
@injectable()
export class MangaRankingController {
    /**
     *
     */
    constructor(private _rankingWebRequest: MangaRankingWebRequestHandler) {}

    @Get(Options.controllerName)
    @requestHandlerDecorator()
    @state()
    @Param.param("rankingType", Param.ParamType.string, true)
    @Param.param("limit", Param.ParamType.int, true)
    @Param.param("offset", Param.ParamType.int, true)
    @Param.param("fields", Param.ParamType.string, true)
    @logArg()
    private async get(req: Request, res: Response, arg: Options.Params) {
        if (arg.limit && arg.limit > 100) {
            arg.limit = 100;
        }

        if (arg.rankingType && possible.includes(req.query.rankingType as string)) {
            type RankingType =
                | "all"
                | "airing"
                | "upcoming"
                | "tv"
                | "ova"
                | "movie"
                | "special"
                | "bypopularity"
                | "favorite";

            arg.rankingType = req.query.rankingType as RankingType;
        }
        let fields: Fields | undefined;
        if (arg.fields) {
            fields = extractFields(arg.fields).fields;
        }

        const result = await this._rankingWebRequest.handle({
            fields,
            limit: arg.limit,
            offset: arg.offset,
            rankingType: arg.rankingType,
            user: arg.user,
        });

        return result.ranked;
    }
}
