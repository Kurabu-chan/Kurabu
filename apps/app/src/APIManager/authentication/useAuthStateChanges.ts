import { Authentication } from "../Authentication";
import { useState } from "react";

export function useAuthStateChanges(stateFilter: (currState: string, prevState: string) => boolean) {
	const authentication = Authentication.GetInstance()
	const [currentState, setCurrentState] = useState(authentication.state);

	authentication.listenForChanges((newState, oldState) => {
		if (stateFilter(newState, oldState)) {
			setCurrentState(newState);
		}
	});

	return [currentState, setCurrentState];
}
