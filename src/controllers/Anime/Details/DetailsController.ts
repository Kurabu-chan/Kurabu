import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import * as Options from "./DetailsControllerOptions";
import State from "../../../decorators/StateDecorator";
import * as Param from "../../../decorators/ParamDecorator";
import LogArg from '../../../decorators/LogArgDecorator';
import RequestHandlerDecorator from '../../../decorators/RequestHandlerDecorator';
import { injectable } from 'tsyringe';
import { DetailsWebRequestHandler } from '../../../webRequest/Anime/Details/DetailsWebRequestHandler';

@Controller(Options.ControllerPath)
@injectable()
export class DetailsController {
    constructor(private _detailsWebRequest: DetailsWebRequestHandler) {
    }

    @Get(Options.ControllerName)
    @RequestHandlerDecorator()
    @State()
    @Param.Param("animeid", Param.ParamType.int, false)
    @LogArg()    
    private async get(req: Request, res: Response, arg: Options.params) {
        arg.animeid = arg.animeid ? arg.animeid : 1;

        var result = await this._detailsWebRequest.handle({
            animeid: arg.animeid,
            uuid: arg.state
        })

        return result.anime;
    }
}