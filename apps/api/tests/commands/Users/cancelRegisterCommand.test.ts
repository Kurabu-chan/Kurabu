/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from "chai";
import { mock, instance, verify, when, anything } from "ts-mockito";
import { CancelUserRegisterCommandHandler } from "#commands/Users/CancelRegister/CancelUserRegisterCommandHandler";
import { User } from "#models/User";
import { UserStatus, UserStatusQueryHandler } from "#queries/Users/Status/UserStatusQueryHandler";
import { ICommandResultStatus } from "#commands/ICommand";
import { IQueryResultStatus } from "#queries/IQuery";
import { CheckUserUUIDQueryHandler } from "#queries/Users/CheckUUID/CheckUserUUIDQueryHandler";

export function cancelRegisterCommand(): void {
    describe("CancelRegisterCommand", () => {
        let userMock: User;
        let userMockInstance: User;
        beforeEach(() => {
            userMock = mock(User);
            userMockInstance = instance(userMock);
        });

        it("Should check the users status", async () => {
            const userStatusMock = mock(UserStatusQueryHandler);
            when(userStatusMock.handle(anything())).thenResolve({
                status: UserStatus.done,
                success: IQueryResultStatus.success,
            });
            const userStatusMockInstance = instance(userStatusMock);

            const userCheckMock = mock(CheckUserUUIDQueryHandler);
            when(userCheckMock.handle(anything())).thenResolve({
                success: ICommandResultStatus.success,
                user: userMockInstance,
            });
            const userCheckMockInstance = instance(userCheckMock);

            const sut = new CancelUserRegisterCommandHandler(
                userStatusMockInstance,
                userCheckMockInstance
            );
            let result;
            try {
                result = await sut.handle({
                    state: "yeah",
                } as any);
            } catch (err) {}

            verify(userMock.destroy()).never();
            verify(userStatusMock.handle(anything())).once();
            expect(result?.success).to.be.undefined;
        });

        it("Should destroy with verif status", async () => {
            const userStatusMock = mock(UserStatusQueryHandler);
            when(userStatusMock.handle(anything())).thenResolve({
                status: UserStatus.verif,
                success: IQueryResultStatus.success,
            });
            const userStatusMockInstance = instance(userStatusMock);

            const userCheckMock = mock(CheckUserUUIDQueryHandler);
            when(userCheckMock.handle(anything())).thenResolve({
                success: ICommandResultStatus.success,
                user: userMockInstance,
            });
            const userCheckMockInstance = instance(userCheckMock);

            const sut = new CancelUserRegisterCommandHandler(
                userStatusMockInstance,
                userCheckMockInstance
            );

            const result = await sut.handle({
                state: "cool",
            } as any);

            verify(userMock.destroy()).once();
            verify(userStatusMock.handle(anything())).once();
            expect(result?.success).to.be.equal(ICommandResultStatus.success);
        });

        it("Should throw with non verif status", async () => {
            const userStatusMock = mock(UserStatusQueryHandler);
            when(userStatusMock.handle(anything())).thenResolve({
                status: UserStatus.done,
                success: IQueryResultStatus.success,
            });
            const userStatusMockInstance = instance(userStatusMock);

            const userCheckMock = mock(CheckUserUUIDQueryHandler);
            when(userCheckMock.handle(anything())).thenResolve({
                success: ICommandResultStatus.success,
                user: userMockInstance,
            });
            const userCheckMockInstance = instance(userCheckMock);

            const sut = new CancelUserRegisterCommandHandler(
                userStatusMockInstance,
                userCheckMockInstance
            );

            let thrown = "";
            let result;
            try {
                result = await sut.handle({
                    state: "yeahbuddy",
                } as any);
            } catch (err) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                thrown = (
                    err as {
                        message: string;
                    }
                ).message;
            }

            verify(userMock.destroy()).never();
            verify(userStatusMock.handle(anything())).once();
            expect(result?.success).to.be.undefined;
            expect(thrown).to.be.equal("State had wrong status during cancel");
        });

        it("Should throw with no state", async () => {
            const userStatusMock = mock(UserStatusQueryHandler);
            when(userStatusMock.handle(anything())).thenResolve({
                status: UserStatus.done,
                success: IQueryResultStatus.success,
            });
            const userStatusMockInstance = instance(userStatusMock);

            const userCheckMock = mock(CheckUserUUIDQueryHandler);
            when(userCheckMock.handle(anything())).thenResolve({
                success: ICommandResultStatus.success,
                user: userMockInstance,
            });
            const userCheckMockInstance = instance(userCheckMock);

            const sut = new CancelUserRegisterCommandHandler(
                userStatusMockInstance,
                userCheckMockInstance
            );

            let thrown = "";
            let result;
            try {
                result = await sut.handle({
                    state: undefined,
                } as any);
            } catch (err) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                thrown = (
                    err as {
                        message: string;
                    }
                ).message;
            }

            verify(userMock.destroy()).never();
            verify(userStatusMock.handle(anything())).never();
            expect(result?.success).to.be.undefined;
            expect(thrown).to.be.equal("State missing during cancel");
        });
    });
}
