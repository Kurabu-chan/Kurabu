import { expect } from "chai";
import { instance } from "ts-mockito";

export const expectThrowsAsync = async (
	method: () => any,
	errorMessage?: string
) => {
	let error = null;
	try {
		await method();
	} catch (err) {
		error = err;
	}

	expect(error).to.be.an("Error");
	if (errorMessage) {
		expect(error.message).to.equal(errorMessage);
	}
};

export const resolvableInstance = <T extends {}>(mock: T) =>
	new Proxy<T>(instance(mock), {
		get(target, name: PropertyKey) {
			if (
				["Symbol(Symbol.toPrimitive)", "then", "catch"].includes(
					name.toString()
				)
			) {
				return undefined;
			}

			return (target as any)[name];
		},
	});
