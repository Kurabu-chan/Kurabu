import { expect } from "chai";
import { instance } from "ts-mockito";

export const expectThrowsAsync = async (
    method: () => any,
    errorMessage?: string
): Promise<void> => {
    let error = null;
    try {
        await method();
    } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        error = err;
    }

    expect(error).to.be.an("Error");
    if (errorMessage) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(
            (
                error as {
                    message: string;
                }
            ).message
        ).to.equal(errorMessage);
    }
};

// eslint-disable-next-line @typescript-eslint/ban-types
export function resolvableInstance<T extends {}>(mock: T): T {
    return new Proxy<T>(instance(mock), {
        get(target, name: PropertyKey) {
            if (["Symbol(Symbol.toPrimitive)", "then", "catch"].includes(name.toString())) {
                return undefined;
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
            return (target as any)[name];
        },
    });
}
