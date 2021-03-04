import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import * as Options from "./RankingControllerOptions";
import State from "../../../decorators/StateDecorator";
import * as Param from "../../../decorators/ParamDecorator";
import { GetRanking } from '../../../MALWrapper/Anime/Ranking';
import { ERROR_STATUS } from '../../../helpers/GLOBALVARS';
import LogArg from '../../../decorators/LogArgDecorator';
import GeneralError from '../../../errors/GeneralError';
import RequestHandlerDecorator from '../../../decorators/RequestHandlerDecorator';
import { autoInjectable, injectable } from 'tsyringe';

const possible = ["all", "airing", "upcoming", "tv", "ova", "movie", "special", "bypopularity", "favorite"];

@Controller(Options.ControllerPath)
@injectable()
export class RankingController {
    @Get(Options.ControllerName)
    @State()
    @Param.Param("rankingtype", Param.ParamType.string, true)
    @Param.Param("limit", Param.ParamType.int, true)
    @Param.Param("offset", Param.ParamType.int, true)
    @LogArg()
    @RequestHandlerDecorator()
    private async get(req: Request, res: Response, arg: Options.params){
        if (arg.limit && arg.limit > 100) {
            arg.limit = 100;
        }

        if (arg.rankingtype && possible.includes(<string>req.query.rankingtype)) {
            arg.rankingtype = <"all" | "airing" | "upcoming" | "tv" | "ova" | "movie" | "special" | "bypopularity" | "favorite">req.query.rankingtype;
        }

        return await GetRanking(arg.state,arg.rankingtype,arg.limit,arg.offset)
    }
}