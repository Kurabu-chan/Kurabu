import { Request, Response } from 'express';
import GeneralError from '../errors/GeneralError';

export default function ErrorHandlerDecorator(){
    return function (target: Object, key: string | symbol, descriptor: PropertyDescriptor){
        const original = descriptor.value;

        descriptor.value = function (req: Request, res: Response, arg: any = {}){
            try{
                const val = original.apply(this, [req,res, arg]);
                return val;
            }catch(err){
                if(err instanceof GeneralError){
                    res.json(err.getHttpCode()).json({
                        status: "error",
                        code: err.getErrorCode(),
                        message: err.message
                    });
                }else{
                    res.json(500).json({
                        status: "error",
                        code: "000",
                        message: err.message
                    });
                }
            }            
        }
    }
}