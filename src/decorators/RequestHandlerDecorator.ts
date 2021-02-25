import { Request, Response } from 'express';
import GeneralError from '../errors/GeneralError';

export default function RequestHandlerDecorator(){
    return function (target: Object, key: string | symbol, descriptor: PropertyDescriptor){
        const original = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, arg: any = {}){
            try{
                const val = original.apply(this, [req,res, arg]);
                console.log(val);
                if(val){
                    if(val instanceof Promise){
                        res.status(200).json(await val);
                    }else{
                        res.status(200).json(val);
                    }
                }
                
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