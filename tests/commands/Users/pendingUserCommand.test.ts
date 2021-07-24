import { expect } from "chai";
import {
	anything,
	instance,
	mock,
	when,
} from "ts-mockito";

import { ICommandResultStatus } from "../../../src/commands/ICommand";
import {
	PendingUserCommandHandler,
} from "../../../src/commands/Users/Pending/PendingUserCommandHandler";
import { Database } from "../../../src/helpers/Database";
import { ModelsType } from "../../../src/models";
import { Tokens } from "../../../src/models/Tokens";
import { User } from "../../../src/models/User";
import { IQueryResultStatus } from "../../../src/queries/IQuery";
import {
	UserStatus,
	UserStatusQueryHandler,
} from "../../../src/queries/Users/Status/UserStatusQueryHandler";
import {
	GetTokenWebRequestHandler,
} from "../../../src/webRequest/Auth/GetToken/GetTokenWebRequestHandler";
import { IWebRequestResultStatus } from "../../../src/webRequest/IWebRequest";
import {
	expectThrowsAsync,
	resolvableInstance,
} from "../../testhelpers/helper";

export function PendingUserCommand() {
	describe("PendingUserCommand", () => {
		it("Should throw if user was not found", async () => {
			var userMock = mock<typeof User>();
			when(userMock.findOne(anything())).thenResolve(undefined as any);

			var modelsMock = mock<ModelsType>();
			when(modelsMock.user).thenReturn(instance(userMock));

			var dbMock = mock<Database>();
			when(dbMock.Models).thenReturn(instance(modelsMock));
			var dbMockInstance = instance(dbMock);

			var sut = new PendingUserCommandHandler(
				undefined as any,
				dbMockInstance,
				undefined as any
			);

			var input = {
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
			var userTypeMock = mock<typeof User>();
			when(userTypeMock.findOne(anything())).thenResolve({} as any);

			var modelsMock = mock<ModelsType>();
			when(modelsMock.user).thenReturn(instance(userTypeMock));

			var dbMock = mock<Database>();
			when(dbMock.Models).thenReturn(instance(modelsMock));
			var dbMockInstance = instance(dbMock);

			var userStatusQueryMock = mock<UserStatusQueryHandler>();
			when(userStatusQueryMock.handle(anything())).thenResolve({
				status: UserStatus.done,
				success: IQueryResultStatus.SUCCESS,
			});
			var userStatusQueryMockInstance = instance(userStatusQueryMock);

			var sut = new PendingUserCommandHandler(
				undefined as any,
				dbMockInstance,
				userStatusQueryMockInstance
			);

			var input = {
				code: "blabla",
				ourdomain: "domain",
				uuid: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
			};

			await expectThrowsAsync(() => sut.handle(input), "uuid is not pending");
		});

		it("Should throw if there are no tokens for user", async () => {
			var userTypeMock = mock<typeof User>();
			when(userTypeMock.findOne(anything())).thenResolve({} as any);

			var tokenTypeMock = mock<typeof Tokens>();
			when(tokenTypeMock.findOne(anything())).thenResolve(undefined as any);

			var modelsMock = mock<ModelsType>();
			when(modelsMock.user).thenReturn(instance(userTypeMock));
			when(modelsMock.tokens).thenReturn(instance(tokenTypeMock));

			var dbMock = mock<Database>();
			when(dbMock.Models).thenReturn(instance(modelsMock));
			var dbMockInstance = instance(dbMock);

			var userStatusQueryMock = mock<UserStatusQueryHandler>();
			when(userStatusQueryMock.handle(anything())).thenResolve({
				status: UserStatus.authing,
				success: IQueryResultStatus.SUCCESS,
			});
			var userStatusQueryMockInstance = instance(userStatusQueryMock);

			// var getTokensMock = mock<GetTokenWebRequestHandler>();
			// when(getTokensMock.handle(anything()))

			var sut = new PendingUserCommandHandler(
				undefined as any,
				dbMockInstance,
				userStatusQueryMockInstance
			);

			var input = {
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
			var userMock = mock<User>();
			when(userMock.tokensId).thenReturn(2);
			var userMockInstance = resolvableInstance(userMock);

			var tokensMock = mock<Tokens>();
			when(tokensMock.update(anything())).thenResolve(undefined as any);
			when(tokensMock.verifier).thenReturn("cool");
			var tokensMockInstance = resolvableInstance(tokensMock);

			var userTypeMock = mock<typeof User>();
			when(userTypeMock.findOne(anything())).thenResolve(userMockInstance);
			var userTypeMockInstance = instance(userTypeMock);

			var tokenTypeMock = mock<typeof Tokens>();
			when(tokenTypeMock.findOne(anything())).thenResolve(tokensMockInstance);
			var tokenTypeMockInstance = instance(tokenTypeMock);

			var modelsMock = mock<ModelsType>();
			when(modelsMock.user).thenReturn(userTypeMockInstance);
			when(modelsMock.tokens).thenReturn(tokenTypeMockInstance);
			var modelsMockInstance = instance(modelsMock);

			var dbMock = mock<Database>();
			when(dbMock.Models).thenReturn(modelsMockInstance);
			var dbMockInstance = instance(dbMock);

			var userStatusQueryMock = mock<UserStatusQueryHandler>();
			when(userStatusQueryMock.handle(anything())).thenResolve({
				status: UserStatus.authing,
				success: IQueryResultStatus.SUCCESS,
			});
			var userStatusQueryMockInstance = instance(userStatusQueryMock);

			var getTokensMock = mock<GetTokenWebRequestHandler>();
			when(getTokensMock.handle(anything())).thenResolve({
				access_token: "",
				expires_in: 0,
				refresh_token: "",
				success: IWebRequestResultStatus.SUCCESS,
				token_type: "Bearer",
			});
			var getTokensMockInstance = instance(getTokensMock);

			var sut = new PendingUserCommandHandler(
				getTokensMockInstance,
				//undefined as any,
				dbMockInstance,
				userStatusQueryMockInstance
				//undefined as any
			);

			var input = {
				code: "blabla",
				ourdomain: "domain",
				uuid: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
			};

			var result = await sut.handle(input);

			var expected = {
				success: ICommandResultStatus.SUCCESS,
				url: `imal://auth/${input.uuid}`,
			};

			expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
		});

		it("Should return custom redirect if data is good and redirect is provided", async () => {
			var tokensMock = mock<Tokens>();
			when(tokensMock.update(anything())).thenResolve(undefined as any);
			when(tokensMock.verifier).thenReturn("cool");
			when(tokensMock.redirect).thenReturn("cool://");
			var tokensMockInstance = resolvableInstance(tokensMock);

			var userMock = mock<User>();
			when(userMock.tokensId).thenReturn(2);
			when(userMock.tokens).thenReturn(tokensMockInstance);
			var userMockInstance = resolvableInstance(userMock);

			var userTypeMock = mock<typeof User>();
			when(userTypeMock.findOne(anything())).thenResolve(userMockInstance);
			var userTypeMockInstance = instance(userTypeMock);

			var tokenTypeMock = mock<typeof Tokens>();
			when(tokenTypeMock.findOne(anything())).thenResolve(tokensMockInstance);
			var tokenTypeMockInstance = instance(tokenTypeMock);

			var modelsMock = mock<ModelsType>();
			when(modelsMock.user).thenReturn(userTypeMockInstance);
			when(modelsMock.tokens).thenReturn(tokenTypeMockInstance);
			var modelsMockInstance = instance(modelsMock);

			var dbMock = mock<Database>();
			when(dbMock.Models).thenReturn(modelsMockInstance);
			var dbMockInstance = instance(dbMock);

			var userStatusQueryMock = mock<UserStatusQueryHandler>();
			when(userStatusQueryMock.handle(anything())).thenResolve({
				status: UserStatus.authing,
				success: IQueryResultStatus.SUCCESS,
			});
			var userStatusQueryMockInstance = instance(userStatusQueryMock);

			var getTokensMock = mock<GetTokenWebRequestHandler>();
			when(getTokensMock.handle(anything())).thenResolve({
				access_token: "",
				expires_in: 0,
				refresh_token: "",
				success: IWebRequestResultStatus.SUCCESS,
				token_type: "Bearer",
			});
			var getTokensMockInstance = instance(getTokensMock);

			var sut = new PendingUserCommandHandler(
				getTokensMockInstance,
				//undefined as any,
				dbMockInstance,
				userStatusQueryMockInstance
				//undefined as any
			);

			var input = {
				code: "blabla",
				ourdomain: "domain",
				uuid: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
			};

			var result = await sut.handle(input);

			var expected = {
				success: ICommandResultStatus.SUCCESS,
				url: `cool://${input.uuid}`,
			};

			expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
		});
	});
}
