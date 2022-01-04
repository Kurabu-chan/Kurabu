/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { autoInjectable } from "tsyringe";
import * as jwt from "jsonwebtoken";
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
import { JWT_ENCRYPTION } from "#helpers/GLOBALVARS";

@autoInjectable()
export class CheckRequestStateQueryHandler
	implements
	IQueryHandler<CheckRequestStateQuery, CheckRequestStateQueryResult> {
	constructor(private _checkUserUUIDQuery: CheckUserUUIDQueryHandler) { }

	async handle({
		req,
	}: CheckRequestStateQuery): Promise<CheckRequestStateQueryResult> {
		const authorization = req.headers.authorization;
		let state = "";
		if (authorization === undefined || authorization === "") {
			// state is one of the paramaters
			const query = req.query.state?.toString();
			const body = req.body.state?.toString();

			state = query ?? body;

			if (!state || state === "") {
				throw new MissingParameterError("Missing required parameter state");
			}
		} else {
			if (Array.isArray(authorization)) {
				throw new MalformedParameterError("Misformatted authentication");
			}
			if (!authorization.startsWith("Bearer ")) {
				throw new MalformedParameterError("Misformatted authentication");
			}

			const token = authorization.split(" ")[1];
			const jwtResult = jwt.verify(token, JWT_ENCRYPTION) as any;
			if (jwtResult.id === undefined) {
				throw new MalformedParameterError("Misformatted authentication");
			}

			state = jwtResult.id;
		}


		// state is valid format
		if (!isUUID(state)) {
			throw new MalformedParameterError("Misformatted authentication");
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
