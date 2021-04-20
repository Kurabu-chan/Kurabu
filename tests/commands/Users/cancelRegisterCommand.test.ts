import { expect } from "chai";
import { CancelUserRegisterCommandHandler } from "../../../src/commands/Users/CancelRegister/CancelUserRegisterCommandHandler";
import { User } from "../../../src/models/User";
import {
	UserStatus,
	UserStatusQueryHandler,
} from "../../../src/queries/Users/Status/UserStatusQueryHandler";

export function CancelRegisterCommand() {
	describe("CancelRegisterCommand", async () => {
		it("Should check the users status", async () => {
			var checkedStatus = false;
			var sut = new CancelUserRegisterCommandHandler({
				handle: (user: User) => {
					checkedStatus = true;
					return { status: UserStatus.done };
				},
			} as any);

			var destroyed = false;

			try {
				var result = await sut.handle({
					user: {
						destroy: () => {
							destroyed = true;
						},
					},
				} as any);
			} catch (err) {}

			expect(checkedStatus).to.be.true;
		});

		it("Should destroy with verif status", async () => {
			var checkedStatus = false;
			var sut = new CancelUserRegisterCommandHandler({
				handle: (user: User) => {
					checkedStatus = true;
					return { status: UserStatus.verif };
				},
			} as any);

			var destroyed = false;

			var result = await sut.handle({
				user: {
					destroy: () => {
						destroyed = true;
					},
				},
			} as any);

			expect(checkedStatus).to.be.true;
			expect(destroyed).to.be.true;
		});

		it("Should throw with non verif status", async () => {
			var checkedStatus = false;
			var sut = new CancelUserRegisterCommandHandler({
				handle: (user: User) => {
					checkedStatus = true;
					return { status: UserStatus.done };
				},
			} as any);

			var destroyed = false;
			var thrown = false;
			try {
				var result = await sut.handle({
					user: {
						destroy: () => {
							destroyed = true;
						},
					},
				} as any);
			} catch (err) {
				thrown = true;
			}

			expect(thrown).to.be.true;
		});

		it("Should throw with no user", async () => {
			var checkedStatus = false;
			var sut = new CancelUserRegisterCommandHandler({
				handle: (user: User) => {
					checkedStatus = true;
					return { status: UserStatus.done };
				},
			} as any);

			var destroyed = false;
			var thrown = false;
			try {
				var result = await sut.handle({ user: undefined } as any);
			} catch (err) {
				thrown = true;
			}

			expect(thrown).to.be.true;
		});
	});
}
