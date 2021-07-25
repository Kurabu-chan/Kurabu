/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
	Request,
	Response,
} from "express";
import { Logger } from "@overnightjs/logger";
import GeneralError from "#errors/GeneralError";

export default function requestHandlerDecorator(log = true) {
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
			try {
				let val = original.apply(this, [req, res, arg]);

				if (val instanceof Promise) {
					val = await val;
				}

				if (val) {
					res.status(200).json(val);

					return val;
				}
			} catch (err) {
				if (err instanceof GeneralError) {
					res.status(err.getHttpCode()).json({
						code: err.getErrorCode(),
						message: err.message,
						status: "error",
					});
				} else {
					res.status(500).json({
						message: "unknown error",
						status: "error",
					});
					if (log) Logger.Err(err);
				}
			}
		};
	};
}
