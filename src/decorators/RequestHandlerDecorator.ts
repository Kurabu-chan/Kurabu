import { Request, Response } from "express";
import GeneralError from "../errors/GeneralError";

export default function RequestHandlerDecorator(log: boolean = true) {
	return function (
		target: Object,
		key: string | symbol,
		descriptor: PropertyDescriptor
	) {
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
						status: "error",
						code: err.getErrorCode(),
						message: err.message,
					});
				} else {
					res.status(500).json({
						status: "error",
						message: "unknown error",
					});
					if (log) console.log(err);
				}
			}
		};
	};
}
