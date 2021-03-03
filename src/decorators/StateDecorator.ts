import { UserManager } from '../helpers/UserManager';
import { Request, Response } from 'express';
import ContainerManager from "../helpers/ContainerManager";

export default function State(){
    return function (target: Object, key: string | symbol, descriptor: PropertyDescriptor){
        const original = descriptor.value;

        descriptor.value = function (req: Request, res: Response, arg: any = {}){
            const userManager = ContainerManager.getInstance().Container.resolve(UserManager);
            let stat = userManager.CheckRequestState(req,res);

            if (typeof stat === "boolean") {
                return;
            }
            let state = <string>stat;

            return original.apply(this, [req,res, {...arg, state: state}]);
        }
    }
}