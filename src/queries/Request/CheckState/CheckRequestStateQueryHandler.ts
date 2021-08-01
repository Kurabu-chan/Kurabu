/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { autoInjectable } from "tsyringe";
import {
	CheckUserUUIDQueryHandler,
} from "../../Users/CheckUUID/CheckUserUUIDQueryHandler";
import { CheckRequestStateQuery } from "./CheckRequestStateQuery";
import { CheckRequestStateQueryResult } from "./CheckRequestStateQueryResult";
import MalformedParameterError from "#errors/Parameter/MalformedParameterError";
import MissingParameterError from "#errors/Parameter/MissingParameterError";
import { isUUID } from "#helpers/randomCodes";

import {
	IQueryHandler,
	IQueryResultStatus,
} from "#queries/IQuery";

@autoInjectable()
export class CheckRequestStateQueryHandler
	implements
		IQueryHandler<CheckRequestStateQuery, CheckRequestStateQueryResult> {
	constructor(private _checkUserUUIDQuery: CheckUserUUIDQueryHandler) {}

	async handle({
		req,
	}: CheckRequestStateQuery): Promise<CheckRequestStateQueryResult> {
		// state is one of the paramaters
		const query = req.query.state?.toString();
		const body = req.body.state?.toString();

		const state: string = query ?? body;

		if (!state || state === "") {
			throw new MissingParameterError("Missing required parameter state");
		}

		// state is valid format
		if (!isUUID(state)) {
			throw new MalformedParameterError("State incorrect format");
		}

		const result = await this._checkUserUUIDQuery.handle({
			uuid: state,
		});

		return {
			state,
			success: IQueryResultStatus.success,
			user: result.user,
		};
	}
}
