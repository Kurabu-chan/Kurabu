/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect } from "chai";
import { Request, Response } from "express";
import { mock, when, anything, instance, anyNumber, capture } from "ts-mockito";
import requestHandlerDecorator from "#decorators/RequestHandlerDecorator";
import AuthenticationError from "#errors/Authentication/AuthenticationError";

class RequestHandlerMock {
	@requestHandlerDecorator()
	public async handle(req: Request, res: Response, arg: any) {
		return {
			cool: "yeah",
		};
	}

	@requestHandlerDecorator(false)
	public async handleAuthErr(req: Request, res: Response, arg: any) {
		throw new AuthenticationError("yeah");
	}

	@requestHandlerDecorator(false)
	public async handleRandomErr(req: Request, res: Response, arg: any) {
		throw new TypeError("yeah");
	}
}

export function requestHandler(): void {
	describe("RequestHandlerDecorator", () => {
		it("Should send a result when endpoint returns", async () => {
			const sut = new RequestHandlerMock();

			const reqMock = mock<Request>();
			when(reqMock.query).thenReturn({});
			when(reqMock.body).thenReturn({});
			const reqMockInstance = instance(reqMock);

			const resMock = mock<Response>();
			when(resMock.json(anything())).thenReturn();
			let resMockInstance = instance(resMock);
			when(resMock.status(anyNumber())).thenReturn(resMockInstance);
			resMockInstance = instance(resMock);

			const result = await sut.handle(reqMockInstance, resMockInstance, {});

			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const [json] = capture(resMock.json).last();
			const [errorCode] = capture(resMock.status.bind(resMock)).last();

			expect(errorCode).to.equal(200);
			expect(JSON.stringify(json)).to.equal(JSON.stringify({ cool: "yeah" }));
		});

		it("Should send an error result when endpoint throws one of our errors", async () => {
			const sut = new RequestHandlerMock();

			const reqMock = mock<Request>();
			when(reqMock.query).thenReturn({});
			when(reqMock.body).thenReturn({});
			const reqMockInstance = instance(reqMock);

			const resMock = mock<Response>();
			when(resMock.json(anything())).thenReturn();
			let resMockInstance = instance(resMock);
			when(resMock.status(anyNumber())).thenReturn(resMockInstance);
			resMockInstance = instance(resMock);

			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const result = await sut.handleAuthErr(
				reqMockInstance,
				resMockInstance,
				{}
			);

			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const [json] = capture(resMock.json).last();
			const [errorCode] = capture(resMock.status.bind(resMock)).last();

			expect(errorCode).to.equal(403);
			expect(json.status).to.equal("error");
			expect(json.code).to.equal("020");
			expect(json.message).to.equal("yeah");
		});

		it("Should send an error result when endpoint throws one a random error", async () => {
			const sut = new RequestHandlerMock();

			const reqMock = mock<Request>();
			when(reqMock.query).thenReturn({});
			when(reqMock.body).thenReturn({});
			const reqMockInstance = instance(reqMock);

			const resMock = mock<Response>();
			when(resMock.json(anything())).thenReturn();
			let resMockInstance = instance(resMock);
			when(resMock.status(anyNumber())).thenReturn(resMockInstance);
			resMockInstance = instance(resMock);

			const result = await sut.handleRandomErr(
				reqMockInstance,
				resMockInstance,
				{}
			);

			const [json] = capture(resMock.json).last();
			const [errorCode] = capture(resMock.status.bind(resMock)).last();

			expect(errorCode).to.equal(500);
			expect(json.status).to.equal("error");
			expect(json.message).to.equal("unknown error");
		});
	});
}
