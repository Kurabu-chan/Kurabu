import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import * as Options from "./SeasonalControllerOptions";
import State from "../../../decorators/StateDecorator";
import * as Param from "../../../decorators/ParamDecorator";
import LogArg from '../../../decorators/LogArgDecorator';
import RequestHandlerDecorator from '../../../decorators/RequestHandlerDecorator';
import { injectable } from 'tsyringe';
import { SeasonalWebRequestHandler } from '../../../webRequest/Anime/Seasonal/SeasonalWebRequestHandler';

const seasons = ["winter", "spring", "summer", "fall"];
const sortScore = ["score", "animescore", "anime_score"];
const sortUsers = ["users", "listed", "list_users", "listusers", "anime_num_list_users", "num_list_users", "num_listusers"]

@Controller(Options.ControllerPath)
@injectable()
export class SeasonalController {
    constructor(private _seasonalWebRequest: SeasonalWebRequestHandler) {
    }

    @Get(Options.ControllerName)
    @RequestHandlerDecorator()
    @State()
    @Param.Param("year", Param.ParamType.int, true)
    @Param.Param("season", Param.ParamType.string, true)
    @Param.Param("sort", Param.ParamType.string, true)
    @Param.Param("limit", Param.ParamType.int, true)
    @Param.Param("offset", Param.ParamType.int, true)
    @LogArg()
    private async get(req: Request, res: Response, arg: Options.params) {
        arg.year = arg.year ?? 2020;
        if (arg.year < 1917) {
            arg.year = 2020;
        } else if (arg.year > 2022) {
            arg.year = 2021;
        }

        arg.season = arg.season ?? "summer";
        if (!seasons.includes(arg.season as string)) {
            arg.season = "summer";
        }

        arg.sort = arg.sort ?? "anime_score";
        if (sortScore.includes(arg.sort as string)) {
            arg.sort = "anime_score";
        } else if (sortUsers.includes(arg.sort as string)) {
            arg.sort = "anime_num_list_users";
        }

        if (arg.limit && arg.limit > 100) {
            arg.limit = 100;
        }

        var result = await this._seasonalWebRequest.handle({
            user: arg.user,
            sort: arg.sort,
            year: arg.year,
            season: arg.season,
            limit: arg.limit,
            offset: arg.offset
        });

        return result.seasonal;
    }
}