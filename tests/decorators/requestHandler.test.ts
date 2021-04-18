import { expect } from "chai";
import { Request, Response } from "express";
import RequestHandlerDecorator from "../../src/decorators/RequestHandlerDecorator";
import AuthenticationError from "../../src/errors/Authentication/AuthenticationError";

class RequestHandlerMock {
	@RequestHandlerDecorator()
	public async handle(req: Request, res: Response, arg: any) {
		return {
			cool: "yeah",
		};
	}

	@RequestHandlerDecorator(false)
	public async handle_auth_err(req: Request, res: Response, arg: any) {
		throw new AuthenticationError("yeah");
	}

	@RequestHandlerDecorator(false)
	public async handle_random_err(req: Request, res: Response, arg: any) {
		throw new TypeError("yeah");
	}
}

export function requestHandler() {
	describe("RequestHandlerDecorator", () => {
		it("Should send a result when endpoint returns", async () => {
			var mock = new RequestHandlerMock();

			var code: number | undefined = undefined;
			var json: string | undefined = undefined;

			var req = {} as any;
			var res = {
				status: (statusCode: number) => {
					code = statusCode;
					return {
						json: (jsonStuff: string) => {
							json = jsonStuff;
						},
					};
				},
			} as any;

			var result = await mock.handle(req, res, {});

			expect(code).to.equal(200);
			expect(JSON.stringify(json)).to.equal(JSON.stringify({ cool: "yeah" }));
		});

		it("Should send an error result when endpoint throws one of our errors", async () => {
			var mock = new RequestHandlerMock();

			var code: number | undefined = undefined;
			var json: any | undefined = undefined;

			var req = {} as any;
			var res = {
				status: (statusCode: number) => {
					code = statusCode;
					return {
						json: (jsonStuff: any) => {
							json = jsonStuff;
						},
					};
				},
			} as any;

			var result = await mock.handle_auth_err(req, res, {});

			expect(code).to.equal(403);
			expect(json.status).to.equal("error");
			expect(json.code).to.equal("020");
			expect(json.message).to.equal("yeah");
		});

		it("Should send an error result when endpoint throws one a random error", async () => {
			var mock = new RequestHandlerMock();

			var code: number | undefined = undefined;
			var json: any | undefined = undefined;

			var req = {} as any;
			var res = {
				status: (statusCode: number) => {
					code = statusCode;
					return {
						json: (jsonStuff: any) => {
							json = jsonStuff;
						},
					};
				},
			} as any;

			var result = await mock.handle_random_err(req, res, {});

			expect(code).to.equal(500);
			expect(json.status).to.equal("error");
			expect(json.message).to.equal("unknown error");
		});
	});
}
