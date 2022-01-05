import { expect } from "chai";
import * as fetch from "node-fetch";
import { addTokenHeader } from "../../src/helpers/refresher";

export function refresher(): void {
    describe("Refresher", () => {
        describe("addTokenHeader", () => {
            it("addTokenHeader should create an init if not provided", () => {
                const expected = {
                    headers: {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        Authorization: "Bearer ___token___",
                    },
                };

                const token = "___token___";

                expect(JSON.stringify(addTokenHeader(token, undefined))).to.equal(
                    JSON.stringify(expected)
                );
            });

            it("addTokenHeader should add headers to init without headers", () => {
                const expected = {
                    headers: {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        Authorization: "Bearer ___token___",
                    },
                };

                const token = "___token___";

                const input = {};

                expect(JSON.stringify(addTokenHeader(token, input))).to.equal(
                    JSON.stringify(expected)
                );
            });

            it("addTokenHeader should add headers to fetch.Headers", () => {
                const input = {
                    headers: new fetch.Headers({}),
                };

                const token = "___token___";

                const expected = "Bearer " + token;

                expect(
                    (addTokenHeader(token, input).headers as fetch.Headers).get("Authorization")
                ).to.equal(expected);
            });
        });
    });
}
