import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import * as Options from "./DetailsControllerOptions";
import State from "../../../decorators/StateDecorator";
import * as Param from "../../../decorators/ParamDecorator";
import { GetDetails } from '../../../MALWrapper/Anime/Details';
import { ERROR_STATUS } from '../../../helpers/GLOBALVARS';
import LogArg from '../../../decorators/LogArgDecorator';

@Controller(Options.ControllerPath)
export class DetailsController {
    @Get(Options.ControllerName)
    @State()
    @Param.Param("animeid", Param.ParamType.int, false)
    @LogArg()
    private get(req: Request, res: Response, arg: Options.params){
        arg.animeid = arg.animeid ? arg.animeid : 1;

        //everything is good        
        GetDetails( arg.state, arg.animeid).then((result) => {
            res.status(200).json(result);
        //Maybe it isnt :()
        }).catch((e) => {
            res.status(500).json({
                status: ERROR_STATUS,
                message: e.message
            });
        });
    }
}