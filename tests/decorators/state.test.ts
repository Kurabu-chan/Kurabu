import { expect } from "chai";
import { Request, Response } from "express";
import ContainerManager from "../../src/helpers/ContainerManager";
import StateDec from "../../src/decorators/StateDecorator";

class StateMock {
	@StateDec()
	public async handle(req: Request, res: Response, arg: any) {
		return arg;
	}
}

export function State() {
	describe("State Decorator", () => {
		ContainerManager.getInstance({
			resolve: (a: any) => {
				// console.log("resolve called");
				// console.log(a);
				return {
					handle: (req: Request, res: Response) => {
						return {
							state: "this is a state",
							user: "This is a user",
						};
					},
				};
			},
		});

		var mock = new StateMock();

		it("State should call CheckRequestStateQueryHandler", async () => {
			let req = {} as any;
			let res = {} as any;

			var result = await mock.handle(req, res, {});

			expect(result.state).to.equal("this is a state");
			expect(result.user).to.equal("This is a user");
		});
	});
}
