import { CancelRegisterCommand } from "./Users/cancelRegisterCommand.test";
import { PendingUserCommand } from "./Users/pendingUserCommand.test";

export function Users() {
	describe("Users", async () => {
		CancelRegisterCommand();
		PendingUserCommand();
	});
}
