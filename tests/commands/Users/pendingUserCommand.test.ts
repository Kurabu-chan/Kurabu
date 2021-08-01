import { expect } from "chai";
import {
	anything,
	instance,
	mock,
	when,
} from "ts-mockito";

import {
	expectThrowsAsync,
	resolvableInstance,
} from "../../testhelpers/helper";
import { ICommandResultStatus } from "#commands/ICommand";
import {
	PendingUserCommandHandler,
} from "#commands/Users/Pending/PendingUserCommandHandler";
import { Database } from "#helpers/Database";
import { ModelsType } from "#models/index";
import { Tokens } from "#models/Tokens";
import { User } from "#models/User";
import { IQueryResultStatus } from "#queries/IQuery";
import {
	UserStatus,
	UserStatusQueryHandler,
} from "#queries/Users/Status/UserStatusQueryHandler";
import {
	GetTokenWebRequestHandler,
} from "#webreq/Auth/GetToken/GetTokenWebRequestHandler";
import { IWebRequestResultStatus } from "#webreq/IWebRequest";

export function pendingUserCommand(): void {
	describe("PendingUserCommand", () => {
		it("Should throw if user was not found", async () => {
			const userMock = mock<typeof User>();
			when(userMock.findOne(anything())).thenResolve(undefined as any);

			const modelsMock = mock<ModelsType>();
			when(modelsMock.user).thenReturn(instance(userMock));

			const dbMock = mock<Database>();
			when(dbMock.models).thenReturn(instance(modelsMock));
			const dbMockInstance = instance(dbMock);

			const sut = new PendingUserCommandHandler(
				undefined as any,
				dbMockInstance,
				undefined as any
			);

			const input = {
				code: "blabla",
				ourdomain: "domain",
				uuid: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
			};

			await expectThrowsAsync(
				() => sut.handle(input),
				"uuid does not exist yet"
			);
		});

		it("Should throw if user status was not pending", async () => {
			const userTypeMock = mock<typeof User>();
			when(userTypeMock.findOne(anything())).thenResolve({} as any);

			const modelsMock = mock<ModelsType>();
			when(modelsMock.user).thenReturn(instance(userTypeMock));

			const dbMock = mock<Database>();
			when(dbMock.models).thenReturn(instance(modelsMock));
			const dbMockInstance = instance(dbMock);

			const userStatusQueryMock = mock<UserStatusQueryHandler>();
			when(userStatusQueryMock.handle(anything())).thenResolve({
				status: UserStatus.done,
				success: IQueryResultStatus.success,
			});
			const userStatusQueryMockInstance = instance(userStatusQueryMock);

			const sut = new PendingUserCommandHandler(
				undefined as any,
				dbMockInstance,
				userStatusQueryMockInstance
			);

			const input = {
				code: "blabla",
				ourdomain: "domain",
				uuid: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
			};

			await expectThrowsAsync(() => sut.handle(input), "uuid is not pending");
		});

		it("Should throw if there are no tokens for user", async () => {
			const userTypeMock = mock<typeof User>();
			when(userTypeMock.findOne(anything())).thenResolve({} as any);

			const tokenTypeMock = mock<typeof Tokens>();
			when(tokenTypeMock.findOne(anything())).thenResolve(undefined as any);

			const modelsMock = mock<ModelsType>();
			when(modelsMock.user).thenReturn(instance(userTypeMock));
			when(modelsMock.tokens).thenReturn(instance(tokenTypeMock));

			const dbMock = mock<Database>();
			when(dbMock.models).thenReturn(instance(modelsMock));
			const dbMockInstance = instance(dbMock);

			const userStatusQueryMock = mock<UserStatusQueryHandler>();
			when(userStatusQueryMock.handle(anything())).thenResolve({
				status: UserStatus.authing,
				success: IQueryResultStatus.success,
			});
			const userStatusQueryMockInstance = instance(userStatusQueryMock);

			// var getTokensMock = mock<GetTokenWebRequestHandler>();
			// when(getTokensMock.handle(anything()))

			const sut = new PendingUserCommandHandler(
				undefined as any,
				dbMockInstance,
				userStatusQueryMockInstance
			);

			const input = {
				code: "blabla",
				ourdomain: "domain",
				uuid: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
			};

			await expectThrowsAsync(
				() => sut.handle(input),
				"No tokens for pending user"
			);
		});

		it("Should return default redirect if data is good", async () => {
			const userMock = mock<User>();
			when(userMock.tokensId).thenReturn(2);
			const userMockInstance = resolvableInstance(userMock);

			const tokensMock = mock<Tokens>();
			when(tokensMock.update(anything())).thenResolve(undefined as any);
			when(tokensMock.verifier).thenReturn("cool");
			const tokensMockInstance = resolvableInstance(tokensMock);

			const userTypeMock = mock<typeof User>();
			when(userTypeMock.findOne(anything())).thenResolve(userMockInstance);
			const userTypeMockInstance = instance(userTypeMock);

			const tokenTypeMock = mock<typeof Tokens>();
			when(tokenTypeMock.findOne(anything())).thenResolve(tokensMockInstance);
			const tokenTypeMockInstance = instance(tokenTypeMock);

			const modelsMock = mock<ModelsType>();
			when(modelsMock.user).thenReturn(userTypeMockInstance);
			when(modelsMock.tokens).thenReturn(tokenTypeMockInstance);
			const modelsMockInstance = instance(modelsMock);

			const dbMock = mock<Database>();
			when(dbMock.models).thenReturn(modelsMockInstance);
			const dbMockInstance = instance(dbMock);

			const userStatusQueryMock = mock<UserStatusQueryHandler>();
			when(userStatusQueryMock.handle(anything())).thenResolve({
				status: UserStatus.authing,
				success: IQueryResultStatus.success,
			});
			const userStatusQueryMockInstance = instance(userStatusQueryMock);

			const getTokensMock = mock<GetTokenWebRequestHandler>();
			when(getTokensMock.handle(anything())).thenResolve({
				accessToken: "",
				expiresIn: 0,
				refreshToken: "",
				success: IWebRequestResultStatus.success,
				tokenType: "Bearer",
			});
			const getTokensMockInstance = instance(getTokensMock);

			const sut = new PendingUserCommandHandler(
				getTokensMockInstance,
				// undefined as any,
				dbMockInstance,
				userStatusQueryMockInstance
				// undefined as any
			);

			const input = {
				code: "blabla",
				ourdomain: "domain",
				uuid: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
			};

			const result = await sut.handle(input);

			const expected = {
				success: ICommandResultStatus.success,
				url: `imal://auth/${input.uuid}`,
			};

			expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
		});

		it("Should return custom redirect if data is good and redirect is provided", async () => {
			const tokensMock = mock<Tokens>();
			when(tokensMock.update(anything())).thenResolve(undefined as any);
			when(tokensMock.verifier).thenReturn("cool");
			when(tokensMock.redirect).thenReturn("cool://");
			const tokensMockInstance = resolvableInstance(tokensMock);

			const userMock = mock<User>();
			when(userMock.tokensId).thenReturn(2);
			when(userMock.tokens).thenReturn(tokensMockInstance);
			const userMockInstance = resolvableInstance(userMock);

			const userTypeMock = mock<typeof User>();
			when(userTypeMock.findOne(anything())).thenResolve(userMockInstance);
			const userTypeMockInstance = instance(userTypeMock);

			const tokenTypeMock = mock<typeof Tokens>();
			when(tokenTypeMock.findOne(anything())).thenResolve(tokensMockInstance);
			const tokenTypeMockInstance = instance(tokenTypeMock);

			const modelsMock = mock<ModelsType>();
			when(modelsMock.user).thenReturn(userTypeMockInstance);
			when(modelsMock.tokens).thenReturn(tokenTypeMockInstance);
			const modelsMockInstance = instance(modelsMock);

			const dbMock = mock<Database>();
			when(dbMock.models).thenReturn(modelsMockInstance);
			const dbMockInstance = instance(dbMock);

			const userStatusQueryMock = mock<UserStatusQueryHandler>();
			when(userStatusQueryMock.handle(anything())).thenResolve({
				status: UserStatus.authing,
				success: IQueryResultStatus.success,
			});
			const userStatusQueryMockInstance = instance(userStatusQueryMock);

			const getTokensMock = mock<GetTokenWebRequestHandler>();
			when(getTokensMock.handle(anything())).thenResolve({
				accessToken: "",
				expiresIn: 0,
				refreshToken: "",
				success: IWebRequestResultStatus.success,
				tokenType: "Bearer",
			});
			const getTokensMockInstance = instance(getTokensMock);

			const sut = new PendingUserCommandHandler(
				getTokensMockInstance,
				// undefined as any,
				dbMockInstance,
				userStatusQueryMockInstance
				// undefined as any
			);

			const input = {
				code: "blabla",
				ourdomain: "domain",
				uuid: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
			};

			const result = await sut.handle(input);

			const expected = {
				success: ICommandResultStatus.success,
				url: `cool://${input.uuid}`,
			};

			expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
		});
	});
}
