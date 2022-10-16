export function formatDeveloperMessage(errorKind: string | undefined, message: string, stack?: string) {
	if (errorKind === undefined) {
		return `${message}
${stack??""}`;
	}

	return `[${errorKind}] ${message}
${stack??""}`;
}

export function formatStackOnly(stack?: string): string | undefined {
	let s = stack?.trim();
	if (s?.startsWith("Error: ")) s = s.replace(/^Error: [\N\w\s]*\n/gm, "");
	return s;
}
