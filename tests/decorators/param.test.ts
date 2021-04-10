import { expect } from "chai";
import {
	Param,
	ParamPos,
	ParamType,
} from "../../src/decorators/ParamDecorator";
import { Request, Response } from "express";

var callbackListener: (success: any) => void = () => {};

class ParamMockClass {
	@Param(
		"cool",
		ParamType.int,
		false,
		ParamPos.either,
		(req, res, result, success) => {
			callbackListener(success);
		}
	)
	public async cool_int_false(req: Request, res: Response, arg: any) {
		return arg;
	}

	@Param(
		"cool",
		ParamType.number,
		false,
		ParamPos.either,
		(req, res, result, success) => {
			callbackListener(success);
		}
	)
	public async cool_float_false(req: Request, res: Response, arg: any) {
		return arg;
	}

	@Param(
		"cool",
		ParamType.int,
		true,
		ParamPos.either,
		(req, res, result, success) => {
			callbackListener(success);
		}
	)
	public async cool_int_true(req: Request, res: Response, arg: any) {
		return arg;
	}

	@Param(
		"cool",
		ParamType.number,
		true,
		ParamPos.either,
		(req, res, result, success) => {
			callbackListener(success);
		}
	)
	public async cool_float_true(req: Request, res: Response, arg: any) {
		return arg;
	}

	@Param(
		"cool",
		ParamType.object,
		true,
		ParamPos.either,
		(req, res, result, success) => {
			callbackListener(success);
		}
	)
	public async cool_object_true(req: Request, res: Response, arg: any) {
		return arg;
	}

	@Param(
		"cool",
		ParamType.string,
		true,
		ParamPos.either,
		(req, res, result, success) => {
			callbackListener(success);
		}
	)
	public async cool_string_true(req: Request, res: Response, arg: any) {
		return arg;
	}

	@Param(
		"cool",
		ParamType.int,
		true,
		ParamPos.body,
		(req, res, result, success) => {
			callbackListener(success);
		}
	)
	public async cool_int_true_body_only(req: Request, res: Response, arg: any) {
		return arg;
	}
}

export function ParamDecorator() {
	describe("ParamDecorator", () => {
		var mockClass = new ParamMockClass();

		describe("Valid", () => {
			it("ParamDecorator should get integer argument if present and valid from both body and query and callback success", async () => {
				var succeeded: any | undefined = undefined;
				callbackListener = (success) => {
					succeeded = success;
				};
				var argResultQuery = await mockClass.cool_int_false(
					{
						query: {
							cool: "21",
						},
						body: {},
					} as any,
					undefined as any,
					undefined as any
				);

				expect(argResultQuery.cool).to.equal(21);
				expect(succeeded).to.equal(true);

				var argResultBody = await mockClass.cool_int_false(
					{
						query: {},
						body: { cool: "21" },
					} as any,
					undefined as any,
					undefined as any
				);

				expect(argResultBody.cool).to.equal(21);
				expect(succeeded).to.equal(true);
			});

			it("ParamDecorator should set param to undefined if not present on optional", async () => {
				var succeeded: any | undefined = undefined;
				callbackListener = (success) => {
					succeeded = success;
				};

				var argResult = await mockClass.cool_int_true(
					{
						query: {},
						body: {},
					} as any,
					undefined as any,
					undefined as any
				);

				expect(argResult.cool).to.equal(undefined);
				expect(succeeded).to.equal(true);
			});

			it("ParamDecorator should only check body when that is set", async () => {
				var succeeded: any | undefined = undefined;
				callbackListener = (success) => {
					succeeded = success;
				};

				var argResultQuery = await mockClass.cool_int_true_body_only(
					{
						query: { cool: "21" },
						body: {},
					} as any,
					undefined as any,
					undefined as any
				);

				expect(argResultQuery.cool).to.equal(undefined);
				expect(succeeded).to.equal(true);

				var argResultBody = await mockClass.cool_int_true_body_only(
					{
						query: {},
						body: { cool: "21" },
					} as any,
					undefined as any,
					undefined as any
				);

				expect(argResultBody.cool).to.equal(21);
				expect(succeeded).to.equal(true);
			});

			it("ParamDecorator should parseFloat correctly", async () => {
				var succeeded: any | undefined = undefined;
				callbackListener = (success) => {
					succeeded = success;
				};

				var argResultQuery = await mockClass.cool_float_true(
					{
						query: {
							cool: "21.01",
						},
						body: {},
					} as any,
					undefined as any,
					undefined as any
				);

				expect(argResultQuery.cool).to.equal(21.01);
				expect(succeeded).to.equal(true);
			});

			it("ParamDecorator should do object correctly", async () => {
				var succeeded: any | undefined = undefined;
				callbackListener = (success) => {
					succeeded = success;
				};

				var expected = {
					alright: "yeah",
				};

				var argResultQuery = await mockClass.cool_object_true(
					{
						query: {
							cool: {
								alright: "yeah",
							},
						},
						body: {},
					} as any,
					undefined as any,
					undefined as any
				);

				expect(JSON.stringify(argResultQuery.cool)).to.equal(
					JSON.stringify(expected)
				);

				expect(succeeded).to.equal(true);
			});

			it("ParamDecorator should do string correctly", async () => {
				var succeeded: any | undefined = undefined;
				callbackListener = (success) => {
					succeeded = success;
				};

				var argResultQuery = await mockClass.cool_string_true(
					{
						query: {
							cool: "yeah",
						},
						body: {},
					} as any,
					undefined as any,
					undefined as any
				);

				expect(argResultQuery.cool).to.equal("yeah");
				expect(succeeded).to.equal(true);
			});
		});

		describe("Invalid", () => {
			it("ParamDecorator should return nothing and send 403 with status 'error' if argument not present on query or body on non optional endpoint", async () => {
				var succeeded: any | undefined = undefined;
				callbackListener = (success) => {
					succeeded = success;
				};

				var request = {
					query: {},
					body: {},
				} as any;

				var errorCode: number = -1;
				var jsonResult: any;

				var response = {
					status: (code: number) => {
						errorCode = code;
						return {
							json: (obj: any) => {
								jsonResult = obj;
							},
						};
					},
				} as any;

				var argResult = await mockClass.cool_int_false(
					request,
					response,
					undefined as any
				);

				expect(succeeded).to.be.false;
				expect(argResult).to.equal(undefined);
				expect(errorCode).to.equal(403);
				expect(jsonResult.status).to.equal("error");
			});

			it("ParamDecorator should return nothing and send 403 with status 'error' if argument wrong format on query on non optional endpoint", async () => {
				var succeeded: any | undefined = undefined;
				callbackListener = (success) => {
					succeeded = success;
				};

				var request = {
					query: {
						cool: "yeah",
					},
					body: {},
				} as any;

				var errorCode: number = -1;
				var jsonResult: any;

				var response = {
					status: (code: number) => {
						errorCode = code;
						return {
							json: (obj: any) => {
								jsonResult = obj;
							},
						};
					},
				} as any;

				var argResult = await mockClass.cool_int_false(
					request,
					response,
					undefined as any
				);

				expect(succeeded).to.be.false;
				expect(argResult).to.equal(undefined);
				expect(errorCode).to.equal(403);
				expect(jsonResult.status).to.equal("error");

				var argResult = await mockClass.cool_float_false(
					request,
					response,
					undefined as any
				);

				expect(succeeded).to.be.false;
				expect(argResult).to.equal(undefined);
				expect(errorCode).to.equal(403);
				expect(jsonResult.status).to.equal("error");
			});
		});
	});
}
