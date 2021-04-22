import { expect } from "chai";
import { CancelUserRegisterCommandHandler } from "../../../src/commands/Users/CancelRegister/CancelUserRegisterCommandHandler";
import { User } from "../../../src/models/User";
import {
	UserStatus,
	UserStatusQueryHandler,
} from "../../../src/queries/Users/Status/UserStatusQueryHandler";
import { mock, instance, verify, when, anything } from "ts-mockito";
import { IQueryResultStatus } from "../../../src/queries/IQuery";
import { ICommandResultStatus } from "../../../src/commands/ICommand";

export function CancelRegisterCommand() {
	describe("CancelRegisterCommand", async () => {
		let userMock: User;
		let userMockInstance: User;
		beforeEach(() => {
			userMock = mock(User);
			userMockInstance = instance(userMock);
		});

		it("Should check the users status", async () => {
			var userStatusMock = mock(UserStatusQueryHandler);
			when(userStatusMock.handle(anything())).thenResolve({
				status: UserStatus.done,
				success: IQueryResultStatus.SUCCESS,
			});
			var userStatusMockInstance = instance(userStatusMock);

			var sut = new CancelUserRegisterCommandHandler(userStatusMockInstance);
			var result = undefined;
			try {
				result = await sut.handle({
					user: userMockInstance,
				} as any);
			} catch (err) {}

			verify(userMock.destroy()).never();
			verify(userStatusMock.handle(anything())).once();
			expect(result?.success).to.be.undefined;
		});

		it("Should destroy with verif status", async () => {
			var userStatusMock = mock(UserStatusQueryHandler);
			when(userStatusMock.handle(anything())).thenResolve({
				status: UserStatus.verif,
				success: IQueryResultStatus.SUCCESS,
			});
			var userStatusMockInstance = instance(userStatusMock);

			var sut = new CancelUserRegisterCommandHandler(userStatusMockInstance);

			var result = await sut.handle({
				user: userMockInstance,
			} as any);

			verify(userMock.destroy()).once();
			verify(userStatusMock.handle(anything())).once();
			expect(result?.success).to.be.equal(ICommandResultStatus.SUCCESS);
		});

		it("Should throw with non verif status", async () => {
			var userStatusMock = mock(UserStatusQueryHandler);
			when(userStatusMock.handle(anything())).thenResolve({
				status: UserStatus.done,
				success: IQueryResultStatus.SUCCESS,
			});
			var userStatusMockInstance = instance(userStatusMock);

			var sut = new CancelUserRegisterCommandHandler(userStatusMockInstance);

			var thrown = "";
			var result = undefined;
			try {
				result = await sut.handle({
					user: userMockInstance,
				} as any);
			} catch (err) {
				thrown = err.message;
			}

			verify(userMock.destroy()).never();
			verify(userStatusMock.handle(anything())).once();
			expect(result?.success).to.be.undefined;
			expect(thrown).to.be.equal("State had wrong status during cancel");
		});

		it("Should throw with no user", async () => {
			var userStatusMock = mock(UserStatusQueryHandler);
			when(userStatusMock.handle(anything())).thenResolve({
				status: UserStatus.done,
				success: IQueryResultStatus.SUCCESS,
			});
			var userStatusMockInstance = instance(userStatusMock);

			var sut = new CancelUserRegisterCommandHandler(userStatusMockInstance);

			var thrown = "";
			var result = undefined;
			try {
				result = await sut.handle({
					user: undefined,
				} as any);
			} catch (err) {
				thrown = err.message;
			}

			verify(userMock.destroy()).never();
			verify(userStatusMock.handle(anything())).never();
			expect(result?.success).to.be.undefined;
			expect(thrown).to.be.equal("State missing during cancel");
		});
	});
}
