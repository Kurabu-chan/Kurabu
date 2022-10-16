import { useAuthStateChanges } from "#api/authentication/useAuthStateChanges";

type Props = {
	authComp: JSX.Element;
	loggedinComp: JSX.Element;
}

export function AuthenticationSwitch(props: Props) {
	const [authState] = useAuthStateChanges((currState: string, prevState: string) => {
		return currState === "Loggedin" || prevState === "Loggedin";
	});

	if (authState === "Loggedin") {
		return props.loggedinComp;
	}

	return props.authComp;
}	
