import { secureStoreOptions } from "#api/authentication/authStateMachine";
import { getItemAsync } from "expo-secure-store";

export const checkTokenStore = async () => {
	const token = await getItemAsync("token", secureStoreOptions);
	const registerToken = await getItemAsync("registerToken", secureStoreOptions);

	if (token !== null) {
		return {
			token
		}
	} else if (registerToken !== null) {
		return {
			registerToken
		}
	} else {
		throw new Error("");
	}
}
