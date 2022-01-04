import { cancelRegisterCommand } from "./Users/cancelRegisterCommand.test";
import { pendingUserCommand } from "./Users/pendingUserCommand.test";

export function users(): void {
	describe("Users", () => {
		cancelRegisterCommand();
		pendingUserCommand();
	});
}
