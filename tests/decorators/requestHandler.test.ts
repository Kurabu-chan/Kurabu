import { expect } from "chai";
import { Request, Response } from "express";
import RequestHandlerDecorator from "../../src/decorators/RequestHandlerDecorator";
import AuthenticationError from "../../src/errors/Authentication/AuthenticationError";
import { mock, when, anything, instance, anyNumber, capture } from "ts-mockito";

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
			var sut = new RequestHandlerMock();

			var reqMock = mock<Request>();
			when(reqMock.query).thenReturn({});
			when(reqMock.body).thenReturn({});
			var reqMockInstance = instance(reqMock);

			var resMock = mock<Response>();
			when(resMock.json(anything())).thenReturn();
			var resMockInstance = instance(resMock);
			when(resMock.status(anyNumber())).thenReturn(resMockInstance);
			resMockInstance = instance(resMock);

			var result = await sut.handle(reqMockInstance, resMockInstance, {});

			var [json] = capture(resMock.json).last();
			var [errorCode] = capture(resMock.status).last();

			expect(errorCode).to.equal(200);
			expect(JSON.stringify(json)).to.equal(JSON.stringify({ cool: "yeah" }));
		});

		it("Should send an error result when endpoint throws one of our errors", async () => {
			var sut = new RequestHandlerMock();

			var reqMock = mock<Request>();
			when(reqMock.query).thenReturn({});
			when(reqMock.body).thenReturn({});
			var reqMockInstance = instance(reqMock);

			var resMock = mock<Response>();
			when(resMock.json(anything())).thenReturn();
			var resMockInstance = instance(resMock);
			when(resMock.status(anyNumber())).thenReturn(resMockInstance);
			resMockInstance = instance(resMock);

			var result = await sut.handle_auth_err(
				reqMockInstance,
				resMockInstance,
				{}
			);

			var [json] = capture(resMock.json).last();
			var [errorCode] = capture(resMock.status).last();

			expect(errorCode).to.equal(403);
			expect(json.status).to.equal("error");
			expect(json.code).to.equal("020");
			expect(json.message).to.equal("yeah");
		});

		it("Should send an error result when endpoint throws one a random error", async () => {
			var sut = new RequestHandlerMock();

			var reqMock = mock<Request>();
			when(reqMock.query).thenReturn({});
			when(reqMock.body).thenReturn({});
			var reqMockInstance = instance(reqMock);

			var resMock = mock<Response>();
			when(resMock.json(anything())).thenReturn();
			var resMockInstance = instance(resMock);
			when(resMock.status(anyNumber())).thenReturn(resMockInstance);
			resMockInstance = instance(resMock);

			var result = await sut.handle_random_err(
				reqMockInstance,
				resMockInstance,
				{}
			);

			var [json] = capture(resMock.json).last();
			var [errorCode] = capture(resMock.status).last();

			expect(errorCode).to.equal(500);
			expect(json.status).to.equal("error");
			expect(json.message).to.equal("unknown error");
		});
	});
}
