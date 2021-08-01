/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
	Request,
	Response,
} from "express";
import ContainerManager from "#helpers/ContainerManager";
import {
	CheckRequestStateQueryHandler,
} from "#queries/Request/CheckState/CheckRequestStateQueryHandler";

export default function state() {
	return function (
		target: any,
		key: string | symbol,
		descriptor: PropertyDescriptor
	):void {
		const original = descriptor.value;

		descriptor.value = async function (
			req: Request,
			res: Response,
			arg: any = {}
		) {
			const container = ContainerManager.getInstance().container;
			const checkRequestStateQuery = container.resolve(
				CheckRequestStateQueryHandler
			);

			const userState = await checkRequestStateQuery.handle({ req, res });

			return original.apply(this, [
				req,
				res,
				{ ...arg, state: userState.state, user: userState.user },
			]);
		};
	};
}
