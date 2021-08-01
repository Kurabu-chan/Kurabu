/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { expect } from "chai";
import { Request, Response } from "express";
import ContainerManager from "../../src/helpers/ContainerManager";
import stateDec from "../../src/decorators/StateDecorator";

class StateMock {
	// eslint-disable-next-line @typescript-eslint/require-await
	@stateDec()
	public async handle(req: Request, res: Response, arg: any):Promise<any> {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return arg;
	}
}

export function state():void {
	describe("State Decorator", () => {
		ContainerManager.getInstance({
			resolve: () => {
				// console.log("resolve called");
				// console.log(a);
				return {
					handle: () => {
						return {
							state: "this is a state",
							user: "This is a user",
						};
					},
				};
			},
		});

		const mock = new StateMock();

		it("State should call CheckRequestStateQueryHandler", async () => {
			const req = {} as any;
			const res = {} as any;

			const result = await mock.handle(req, res, {});

			expect(result.state).to.equal("this is a state");
			expect(result.user).to.equal("This is a user");
		});
	});
}
