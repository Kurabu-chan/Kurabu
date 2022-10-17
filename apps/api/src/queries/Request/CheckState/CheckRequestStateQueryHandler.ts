/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { autoInjectable } from "tsyringe";
import * as jwt from "jsonwebtoken";
import { CheckUserUUIDQueryHandler } from "../../Users/CheckUUID/CheckUserUUIDQueryHandler";
import { CheckRequestStateQuery } from "./CheckRequestStateQuery";
import { CheckRequestStateQueryResult } from "./CheckRequestStateQueryResult";
import MalformedParameterError from "#errors/Parameter/MalformedParameterError";
import MissingParameterError from "#errors/Parameter/MissingParameterError";
import { isUUID } from "#helpers/randomCodes";
import { IQueryHandler, IQueryResultStatus } from "#queries/IQuery";
import { JWT_ENCRYPTION } from "#helpers/GLOBALVARS";

@autoInjectable()
export class CheckRequestStateQueryHandler
	implements IQueryHandler<CheckRequestStateQuery, CheckRequestStateQueryResult>
{
	constructor(private _checkUserUUIDQuery: CheckUserUUIDQueryHandler) { }

	async handle({ req }: CheckRequestStateQuery): Promise<CheckRequestStateQueryResult> {
		const authorization = req.headers.authorization;
		let state = "";
		let isJwt = false;

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

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const jwtRes = useJWT(token, true);
			if (jwtRes === undefined) throw Error("not supposed to happen");
			state = jwtRes.id;
			isJwt = true;
		}

		const jwtResult = useJWT(state, false);

		if (jwtResult !== undefined) {
			state = jwtResult.id;
			isJwt = true;
		}

		// state is valid format
		if (!isUUID(state)) {
			throw new MalformedParameterError("Misformatted authentication");
		}

		const result = await this._checkUserUUIDQuery.handle({
			uuid: state,
		});

		return {
			isJwt,
			state,
			success: IQueryResultStatus.success,
			user: result.user,
		};
	}
}

function useJWT(token: string, throwOnError: boolean): undefined | { id: string } {

	try {
		const jwtResult = jwt.verify(token, JWT_ENCRYPTION) as unknown;

		if (typeof jwtResult !== "object")
			return throwIfTrue(throwOnError,
				new MalformedParameterError("Misformatted authentication"));
		if (jwtResult === null || jwtResult === undefined)
			return throwIfTrue(throwOnError,
				new MalformedParameterError("Misformatted authentication"));

		// eslint-disable-next-line @typescript-eslint/ban-types
		if (!("id" in (jwtResult as {}))) {
			return throwIfTrue(throwOnError,
				new MalformedParameterError("Misformatted authentication"));
		}

		return jwtResult as {
			id: string;
		};
	} catch (err: unknown) {
		if (err instanceof jwt.JsonWebTokenError) {
			return throwIfTrue(throwOnError,
				new MalformedParameterError("Misformatted authentication"));
		}
	}
}

function throwIfTrue(val: boolean, error: Error) {
	if (val === true) throw error;
	return undefined;
}
