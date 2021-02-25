import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import * as Options from "./RankingControllerOptions";
import State from "../../../decorators/StateDecorator";
import * as Param from "../../../decorators/ParamDecorator";
import { GetRanking } from '../../../MALWrapper/Anime/Ranking';
import { ERROR_STATUS } from '../../../helpers/GLOBALVARS';

const possible = ["all", "airing", "upcoming", "tv", "ova", "movie", "special", "bypopularity", "favorite"];

@Controller(Options.ControllerPath)
export class RankingController {
    @Get(Options.ControllerName)
    @State()
    @Param.Param("rankingtype", Param.ParamType.string, true)
    @Param.Param("limit", Param.ParamType.int, true)
    @Param.Param("offset", Param.ParamType.int, true)
    private get(req: Request, res: Response, arg: Options.params){
        if (arg.limit && arg.limit > 100) {
            arg.limit = 100;
        }

        if (arg.rankingtype && possible.includes(<string>req.query.rankingtype)) {
            arg.rankingtype = <"all" | "airing" | "upcoming" | "tv" | "ova" | "movie" | "special" | "bypopularity" | "favorite">req.query.rankingtype;
        }

        GetRanking(arg.state,arg.rankingtype,arg.limit,arg.offset).then((result) => {
                res.status(200).json(result);
        }).catch((e) => {
            res.status(500).json({
                status: ERROR_STATUS,
                message: e.message
            });
        });
    }
}