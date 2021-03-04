import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import * as Options from "./DetailsControllerOptions";
import State from "../../../decorators/StateDecorator";
import * as Param from "../../../decorators/ParamDecorator";
import { GetDetails } from '../../../MALWrapper/Anime/Details';
import LogArg from '../../../decorators/LogArgDecorator';
import RequestHandlerDecorator from '../../../decorators/RequestHandlerDecorator';
import { injectable } from 'tsyringe';

@Controller(Options.ControllerPath)
@injectable()
export class DetailsController {
    @Get(Options.ControllerName)
    @State()
    @Param.Param("animeid", Param.ParamType.int, false)
    @LogArg()
    @RequestHandlerDecorator()
    private async get(req: Request, res: Response, arg: Options.params) {
        arg.animeid = arg.animeid ? arg.animeid : 1;

        return await GetDetails(arg.state, arg.animeid);
    }
}