import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import * as Options from "./SuggestionsControllerOptions";
import State from "../../../decorators/StateDecorator";
import * as Param from "../../../decorators/ParamDecorator";
import LogArg from '../../../decorators/LogArgDecorator';
import RequestHandlerDecorator from '../../../decorators/RequestHandlerDecorator';
import { injectable } from 'tsyringe';
import { SuggestionsWebRequestHandler } from '../../../webRequest/Anime/Suggestions/SuggestionsWebRequestHandler';

@Controller(Options.ControllerPath)
@injectable()
export class SuggestionsController {
    constructor(private _suggestionsWebRequest: SuggestionsWebRequestHandler){
    }

    @Get(Options.ControllerName)
    @RequestHandlerDecorator()
    @State()
    @Param.Param("limit", Param.ParamType.int, true)
    @Param.Param("offset", Param.ParamType.int, true)
    @LogArg()
    private async get(req: Request, res: Response, arg: Options.params) {
        arg.limit;
        if (arg.limit && arg.limit > 100) {
            arg.limit = 100;
        }

        var result = await this._suggestionsWebRequest.handle({
            uuid: arg.state,
            limit: arg.limit,
            offset: arg.offset
        })

        return result.suggestions;
    }
}