import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import * as Options from "./AuthedControllerOptions";
import { ERROR_STATUS } from '../../helpers/GLOBALVARS';
import LogArg from '../../decorators/LogArgDecorator';
import { UserManager } from '../../helpers/UserManager';
import { Param, ParamPos, ParamType } from '../../decorators/ParamDecorator';
import State from '../../decorators/StateDecorator';
import { Logger } from '@overnightjs/logger';

@Controller(Options.ControllerPath)
export class AuthedController {
    @Get(Options.ControllerName)
    @State()
    @Param("error", ParamType.string, true, ParamPos.either, AuthedController.ErrorCallback)
    @Param("code", ParamType.string, false, ParamPos.either, AuthedController.CodeCallback)
    private get(req: Request, res: Response, arg: Options.params) {
        const codeRe = /[0-9a-z]{700,1300}/ 
        //code wrong format
        if (!arg.code.match(codeRe)) {
            Logger.Warn("Code parameter was of incorrect format in request to /authed");
            
            UserManager.GetInstance().SetErrored(arg.state);
            res.status(422).json({
                status: ERROR_STATUS,
                message:"There is a problem with one of your parameters"
            });
            return;
        }
        
        let ourdomain = `${req.protocol}://${req.hostname}`;
        UserManager.GetInstance().DoPending(arg.state, arg.code, ourdomain).then((redirUrl) => {
            console.log()
            res.redirect(redirUrl);
        }).catch((err) => {
            res.status(403).json({
                status: ERROR_STATUS,
                message: err.message
            });
        });   
    }

    private static ErrorCallback(req: Request, res: Response,arg: Options.params, success:boolean){
        if(!success){
            UserManager.GetInstance().SetCanceled(arg.state);
        }        
    }

    private static CodeCallback(req: Request, res: Response,arg: Options.params, success:boolean){
        if(!success){
            UserManager.GetInstance().SetErrored(arg.state);
        }        
    }
}