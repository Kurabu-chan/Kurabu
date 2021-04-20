import { CancelRegisterCommand } from "./Users/cancelRegisterCommand.test";

export function Users() {
	describe("Users", async () => {
		CancelRegisterCommand();
	});
}
