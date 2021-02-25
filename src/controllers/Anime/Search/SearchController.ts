import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import * as Options from "./SearchControllerOptions";
import State from "../../../decorators/StateDecorator";
import * as Param from "../../../decorators/ParamDecorator";
import { GetSearch } from '../../../MALWrapper/Anime/Search';
import { ERROR_STATUS } from '../../../helpers/GLOBALVARS';
import LogArg from '../../../decorators/LogArgDecorator';
import GeneralError from '../../../errors/GeneralError';
import RequestHandlerDecorator from '../../../decorators/RequestHandlerDecorator';

@Controller(Options.ControllerPath)
export class SearchController {
    @Get(Options.ControllerName)
    @State()
    @Param.Param("query", Param.ParamType.string, false)
    @Param.Param("limit", Param.ParamType.int, true)
    @Param.Param("offset", Param.ParamType.int, true)
    @LogArg()
    @RequestHandlerDecorator()
    private async get(req: Request, res: Response, arg: Options.params){
        if (arg.limit && arg.limit > 100) {
            arg.limit = 100;
        }

        return await GetSearch(arg.state,arg.query,arg.limit, arg.offset);     
    }
}