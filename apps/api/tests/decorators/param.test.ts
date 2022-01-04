/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { expect } from "chai";
import { Request, Response } from "express";
import {
	mock,
	instance,
	when,
	anyNumber,
	anything,
	capture,
} from "ts-mockito";
import {
	param,
	ParamPos,
	ParamType,
} from "../../src/decorators/ParamDecorator";

let callbackListener: (success: any) => void = () => { };

class ParamMockClass {
	@param(
		"cool",
		ParamType.int,
		false,
		ParamPos.either,
		(req, res, result, success) => {
			callbackListener(success);
		}
	)
	public coolIntFalse(req: Request, res: Response, arg: any): any {
		return arg;
	}

	@param(
		"cool",
		ParamType.boolean,
		false,
		ParamPos.either,
		(req, res, result, success) => {
			callbackListener(success);
		}
	)
	public coolBooleanFalse(req: Request, res: Response, arg: any): any {
		return arg;
	}

	@param(
		"cool",
		ParamType.boolean,
		true,
		ParamPos.either,
		(req, res, result, success) => {
			callbackListener(success);
		}
	)
	public coolBooleanTrue(req: Request, res: Response, arg: any): any {
		return arg;
	}

	@param(
		"cool",
		ParamType.number,
		false,
		ParamPos.either,
		(req, res, result, success) => {
			callbackListener(success);
		}
	)
	public coolFloatFalse(req: Request, res: Response, arg: any): any {
		return arg;
	}

	@param(
		"cool",
		ParamType.int,
		true,
		ParamPos.either,
		(req, res, result, success) => {
			callbackListener(success);
		}
	)
	public coolIntTrue(req: Request, res: Response, arg: any): any {
		return arg;
	}

	@param(
		"cool",
		ParamType.number,
		true,
		ParamPos.either,
		(req, res, result, success) => {
			callbackListener(success);
		}
	)
	public coolFloatTrue(req: Request, res: Response, arg: any): any {
		return arg;
	}

	@param(
		"cool",
		ParamType.object,
		true,
		ParamPos.either,
		(req, res, result, success) => {
			callbackListener(success);
		}
	)
	public coolObjectTrue(req: Request, res: Response, arg: any): any {
		return arg;
	}

	@param(
		"cool",
		ParamType.string,
		true,
		ParamPos.either,
		(req, res, result, success) => {
			callbackListener(success);
		}
	)
	public coolStringTrue(req: Request, res: Response, arg: any): any {
		return arg;
	}

	@param(
		"cool",
		ParamType.int,
		true,
		ParamPos.body,
		(req, res, result, success) => {
			callbackListener(success);
		}
	)
	public coolIntTrueBodyOnly(req: Request, res: Response, arg: any): any {
		return arg;
	}
}

export function paramDecorator(): void {
	describe("ParamDecorator", () => {
		const mockClass = new ParamMockClass();

		describe("Valid", () => {
			// eslint-disable-next-line max-len
			it("ParamDecorator should get integer argument if present and valid from both body and query and callback success", async () => {
				let succeeded: any | undefined;
				callbackListener = (success) => {
					succeeded = success;
				};

				const reqMock = mock<Request>();
				when(reqMock.query).thenReturn({
					cool: "21",
				});
				when(reqMock.body).thenReturn({});
				const reqMockInstance = instance(reqMock);

				const argResultQuery = await mockClass.coolIntFalse(
					reqMockInstance,
					undefined as any,
					undefined as any
				);

				expect(argResultQuery.cool).to.equal(21);
				expect(succeeded).to.equal(true);

				const argResultBody = await mockClass.coolIntFalse(
					reqMockInstance,
					undefined as any,
					undefined as any
				);

				expect(argResultBody.cool).to.equal(21);
				expect(succeeded).to.equal(true);
			});

			// eslint-disable-next-line max-len
			it("ParamDecorator should get boolean argument if present and valid from both body and query and callback success", async () => {
				let succeeded: any | undefined;
				callbackListener = (success) => {
					succeeded = success;
				};

				let reqMock = mock<Request>();
				when(reqMock.query).thenReturn({
					cool: "true",
				});
				when(reqMock.body).thenReturn({});
				let reqMockInstance = instance(reqMock);

				const argResultQuery = await mockClass.coolBooleanFalse(
					reqMockInstance,
					undefined as any,
					undefined as any
				);

				expect(argResultQuery.cool).to.equal(true);
				expect(succeeded).to.equal(true);

				reqMock = mock<Request>();
				when(reqMock.query).thenReturn({});
				when(reqMock.body).thenReturn({
					cool: true,
				});
				reqMockInstance = instance(reqMock);

				const argResultBody = await mockClass.coolBooleanFalse(
					reqMockInstance,
					undefined as any,
					undefined as any
				);

				expect(argResultBody.cool).to.equal(true);
				expect(succeeded).to.equal(true);
			});

			// eslint-disable-next-line max-len
			it("ParamDecorator should ignore empty boolean for non required", async () => {
				let succeeded: any | undefined;
				callbackListener = (success) => {
					succeeded = success;
				};

				const reqMock = mock<Request>();
				when(reqMock.query).thenReturn({});
				when(reqMock.body).thenReturn({});
				const reqMockInstance = instance(reqMock);

				const argResultQuery = await mockClass.coolBooleanTrue(
					reqMockInstance,
					undefined as any,
					undefined as any
				);

				expect(argResultQuery.cool).to.equal(undefined);
				expect(succeeded).to.equal(true);
			});

			// eslint-disable-next-line max-len
			it("ParamDecorator should set param to undefined if not present on optional", async () => {
				let succeeded: any | undefined;
				callbackListener = (success) => {
					succeeded = success;
				};

				const reqMock = mock<Request>();
				when(reqMock.query).thenReturn({});
				when(reqMock.body).thenReturn({});
				const reqMockInstance = instance(reqMock);

				const argResult = await mockClass.coolIntTrue(
					reqMockInstance,
					undefined as any,
					undefined as any
				);

				expect(argResult.cool).to.equal(undefined);
				expect(succeeded).to.equal(true);
			});

			it("ParamDecorator should only check body when that is set", async () => {
				let succeeded: any | undefined;
				callbackListener = (success) => {
					succeeded = success;
				};

				let reqMock = mock<Request>();
				when(reqMock.query).thenReturn({ cool: "21" });
				when(reqMock.body).thenReturn({});
				let reqMockInstance = instance(reqMock);

				const argResultQuery = await mockClass.coolIntTrueBodyOnly(
					reqMockInstance,
					undefined as any,
					undefined as any
				);

				expect(argResultQuery.cool).to.equal(undefined);
				expect(succeeded).to.equal(true);

				reqMock = mock<Request>();
				when(reqMock.query).thenReturn({});
				when(reqMock.body).thenReturn({ cool: "21" });
				reqMockInstance = instance(reqMock);

				const argResultBody = await mockClass.coolIntTrueBodyOnly(
					reqMockInstance,
					undefined as any,
					undefined as any
				);

				expect(argResultBody.cool).to.equal(21);
				expect(succeeded).to.equal(true);
			});

			it("ParamDecorator should parseFloat correctly", async () => {
				let succeeded: any | undefined;
				callbackListener = (success) => {
					succeeded = success;
				};

				const reqMock = mock<Request>();
				when(reqMock.query).thenReturn({ cool: "21.01" });
				when(reqMock.body).thenReturn({});
				const reqMockInstance = instance(reqMock);

				const argResultQuery = await mockClass.coolFloatTrue(
					reqMockInstance,
					undefined as any,
					undefined as any
				);

				expect(argResultQuery.cool).to.equal(21.01);
				expect(succeeded).to.equal(true);
			});

			it("ParamDecorator should do object correctly", async () => {
				let succeeded: any | undefined;
				callbackListener = (success) => {
					succeeded = success;
				};

				const expected = {
					alright: "yeah",
				};

				const reqMock = mock<Request>();
				when(reqMock.query).thenReturn({
					cool: expected,
				});
				when(reqMock.body).thenReturn({});
				const reqMockInstance = instance(reqMock);

				const argResultQuery = await mockClass.coolObjectTrue(
					reqMockInstance,
					undefined as any,
					undefined as any
				);

				expect(JSON.stringify(argResultQuery.cool)).to.equal(
					JSON.stringify(expected)
				);

				expect(succeeded).to.equal(true);
			});

			it("ParamDecorator should do string correctly", async () => {
				let succeeded: any | undefined;
				callbackListener = (success) => {
					succeeded = success;
				};

				const reqMock = mock<Request>();
				when(reqMock.query).thenReturn({
					cool: "yeah",
				});
				when(reqMock.body).thenReturn({});
				const reqMockInstance = instance(reqMock);

				const argResultQuery = await mockClass.coolStringTrue(
					reqMockInstance,
					undefined as any,
					undefined as any
				);

				expect(argResultQuery.cool).to.equal("yeah");
				expect(succeeded).to.equal(true);
			});
		});

		describe("Invalid", () => {
			// eslint-disable-next-line max-len
			it("ParamDecorator should return nothing and send 403 with status 'error' if argument not present on query or body on non optional endpoint", async () => {
				let succeeded: any | undefined;
				callbackListener = (success) => {
					succeeded = success;
				};

				const reqMock = mock<Request>();
				when(reqMock.query).thenReturn({});
				when(reqMock.body).thenReturn({});
				const reqMockInstance = instance(reqMock);

				const resMock = mock<Response>();
				when(resMock.json(anything())).thenReturn();
				let resMockInstance = instance(resMock);
				when(resMock.status(anyNumber())).thenReturn(resMockInstance);
				resMockInstance = instance(resMock);

				const argResult = await mockClass.coolIntFalse(
					reqMockInstance,
					resMockInstance,
					undefined as any
				);

				const [json] = capture(resMock.json).last();
				const [errorCode] = capture(resMock.status.bind(resMock)).last();

				expect(succeeded).to.be.false;
				expect(argResult).to.equal(undefined);
				expect(errorCode).to.equal(403);
				expect(json.status).to.equal("error");
			});

			// eslint-disable-next-line max-len
			it("ParamDecorator should return nothing and send 403 with status 'error' if argument wrong format on query on non optional endpoint", async () => {
				let succeeded: any | undefined;
				callbackListener = (success) => {
					succeeded = success;
				};

				const reqMock = mock<Request>();
				when(reqMock.query).thenReturn({});
				when(reqMock.body).thenReturn({});
				const reqMockInstance = instance(reqMock);

				const resMock = mock<Response>();
				when(resMock.json(anything())).thenReturn();
				let resMockInstance = instance(resMock);
				when(resMock.status(anyNumber())).thenReturn(resMockInstance);
				resMockInstance = instance(resMock);

				const argResult1 = await mockClass.coolIntFalse(
					reqMockInstance,
					resMockInstance,
					undefined as any
				);

				const [json1] = capture(resMock.json).last();
				const [errorCode1] = capture(resMock.status.bind(resMock)).last();

				expect(succeeded).to.be.false;
				expect(argResult1).to.equal(undefined);
				expect(errorCode1).to.equal(403);
				expect(json1.status).to.equal("error");

				const argResult2 = await mockClass.coolFloatFalse(
					reqMockInstance,
					resMockInstance,
					undefined as any
				);

				const [json2] = capture(resMock.json).last();
				const [errorCode2] = capture(resMock.status.bind(resMock)).last();

				expect(succeeded).to.be.false;
				expect(argResult2).to.equal(undefined);
				expect(errorCode2).to.equal(403);
				expect(json2.status).to.equal("error");
			});
		});
	});
}
