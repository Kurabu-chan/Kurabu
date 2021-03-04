import { autoInjectable } from "tsyringe";
import MalformedParameterError from "../../../errors/Parameter/MalformedParameterError";
import MissingParameterError from "../../../errors/Parameter/MissingParameterError";
import { isUUID } from "../../../helpers/randomCodes";
import { IQueryHandler, IQueryResultStatus } from "../../IQuery";
import { CheckUserUUIDQueryHandler } from "../../Users/CheckUUID/CheckUserUUIDQueryHandler";
import { CheckRequestStateQuery } from "./CheckRequestStateQuery";
import { CheckRequestStateQueryResult } from "./CheckRequestStateQueryResult";


@autoInjectable()
export class CheckRequestStateQueryHandler implements IQueryHandler<CheckRequestStateQuery, CheckRequestStateQueryResult>{
    constructor(private _checkUserUUIDQuery: CheckUserUUIDQueryHandler) { }

    async handle({ req, res }: CheckRequestStateQuery): Promise<CheckRequestStateQueryResult> {
        //state is one of the paramaters
        let query = req.query["state"]?.toString();
        let body = req.body["state"]?.toString();

        let state: string = query ?? body;

        if (!state || state == "") {
            throw new MissingParameterError("Missing required parameter state");
        }

        //state is valid format
        if (!isUUID(state)) {
            throw new MalformedParameterError("State incorrect format");
        }

        await this._checkUserUUIDQuery.handle({
            uuid: state
        });

        return {
            state: state,
            success: IQueryResultStatus.SUCCESS
        };
    }
}