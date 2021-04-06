import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import * as Options from "./RankingControllerOptions";
import State from "../../../decorators/StateDecorator";
import * as Param from "../../../decorators/ParamDecorator";
import LogArg from '../../../decorators/LogArgDecorator';
import RequestHandlerDecorator from '../../../decorators/RequestHandlerDecorator';
import { injectable } from 'tsyringe';
import { RankingWebRequestHandler } from '../../../webRequest/Anime/Ranking/RankingWebRequestHandler';

const possible = ["all", "airing", "upcoming", "tv", "ova", "movie", "special", "bypopularity", "favorite"];

@Controller(Options.ControllerPath)
@injectable()
export class RankingController {
    /**
     *
     */
    constructor(private _rankingWebRequest: RankingWebRequestHandler) {
    }

    @Get(Options.ControllerName)
    @RequestHandlerDecorator()
    @State()
    @Param.Param("rankingtype", Param.ParamType.string, true)
    @Param.Param("limit", Param.ParamType.int, true)
    @Param.Param("offset", Param.ParamType.int, true)
    @LogArg()
    private async get(req: Request, res: Response, arg: Options.params) {
        if (arg.limit && arg.limit > 100) {
            arg.limit = 100;
        }

        if (arg.rankingtype && possible.includes(<string>req.query.rankingtype)) {
            arg.rankingtype = <"all" | "airing" | "upcoming" | "tv" | "ova" | "movie" | "special" | "bypopularity" | "favorite">req.query.rankingtype;
        }

        var result = await this._rankingWebRequest.handle({
            user: arg.user,
            rankingtype: arg.rankingtype,
            limit: arg.limit,
            offset: arg.offset
        })

        return result.ranked;
    }
}