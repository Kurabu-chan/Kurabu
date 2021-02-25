import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import * as Options from "./SearchControllerOptions";
import State from "../../../decorators/StateDecorator";
import * as Param from "../../../decorators/ParamDecorator";
import { GetSearch } from '../../../MALWrapper/Anime/Search';
import { ERROR_STATUS } from '../../../helpers/GLOBALVARS';

@Controller(Options.ControllerPath)
export class SearchController {
    @Get(Options.ControllerName)
    @State()
    @Param.Param("query", Param.ParamType.string, false)
    @Param.Param("limit", Param.ParamType.int, true)
    @Param.Param("offset", Param.ParamType.int, true)
    private get(req: Request, res: Response, arg: Options.params){
        if (arg.limit && arg.limit > 100) {
            arg.limit = 100;
        }

        GetSearch(arg.state,arg.query,arg.limit, arg.offset).then((result) => {            
            res.status(200).json(result);            
        }).catch((e) => {
            res.status(500).json({
                status: ERROR_STATUS,
                message: e.message
            });
        });  
    }
}