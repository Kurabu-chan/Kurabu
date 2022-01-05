import { camelToSnakeCase } from "./deepRename/camelToSnakeCase.test";

export function deepRename(): void {
    describe("deepRename", () => {
        camelToSnakeCase();
    });
}
