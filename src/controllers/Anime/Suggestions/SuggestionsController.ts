import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import * as Options from "./SuggestionsControllerOptions";
import State from "../../../decorators/StateDecorator";
import * as Param from "../../../decorators/ParamDecorator";
import { GetSuggested } from '../../../MALWrapper/Anime/Suggestions';
import { ERROR_STATUS } from '../../../helpers/GLOBALVARS';
import LogArg from '../../../decorators/LogArgDecorator';

@Controller(Options.ControllerPath)
export class SuggestionsController {
    @Get(Options.ControllerName)
    @State()
    @Param.Param("limit", Param.ParamType.int, true)
    @Param.Param("offset", Param.ParamType.int, true)
    @LogArg()
    private get(req: Request, res: Response, arg: Options.params){
        arg.limit;
        if (arg.limit && arg.limit > 100) {
            arg.limit = 100;
        }
        
        GetSuggested(arg.state, arg.limit, arg.offset).then((result) => {
            res.status(200).json(result);
        }).catch((e) => {
            res.status(500).json({
                status: ERROR_STATUS,
                message: e.message
            });
        }); 
    }
}