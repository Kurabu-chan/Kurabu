import { Request, Response } from 'express';
import ContainerManager from "../helpers/ContainerManager";
import { CheckRequestStateQueryHandler } from '../queries/Request/CheckState/CheckRequestStateQueryHandler';

export default function State() {
    return function (target: Object, key: string | symbol, descriptor: PropertyDescriptor) {
        const original = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, arg: any = {}) {
            const container = ContainerManager.getInstance().Container;
            const checkRequestStateQuery = container.resolve(CheckRequestStateQueryHandler);

            let state = await checkRequestStateQuery.handle({ req: req, res: res });

            return original.apply(this, [req, res, { ...arg, state: state.state }]);
        }
    }
}