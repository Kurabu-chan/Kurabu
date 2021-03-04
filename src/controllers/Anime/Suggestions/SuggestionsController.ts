import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import * as Options from "./SuggestionsControllerOptions";
import State from "../../../decorators/StateDecorator";
import * as Param from "../../../decorators/ParamDecorator";
import { GetSuggested } from '../../../MALWrapper/Anime/Suggestions';
import LogArg from '../../../decorators/LogArgDecorator';
import RequestHandlerDecorator from '../../../decorators/RequestHandlerDecorator';
import { injectable } from 'tsyringe';

@Controller(Options.ControllerPath)
@injectable()
export class SuggestionsController {
    @Get(Options.ControllerName)
    @State()
    @Param.Param("limit", Param.ParamType.int, true)
    @Param.Param("offset", Param.ParamType.int, true)
    @LogArg()
    @RequestHandlerDecorator()
    private async get(req: Request, res: Response, arg: Options.params) {
        arg.limit;
        if (arg.limit && arg.limit > 100) {
            arg.limit = 100;
        }

        return await GetSuggested(arg.state, arg.limit, arg.offset);
    }
}