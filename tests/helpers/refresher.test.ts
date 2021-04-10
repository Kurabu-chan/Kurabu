import { expect } from "chai";
import { addTokenHeader } from "../../src/helpers/refresher";
import * as fetch from "node-fetch";

describe("Refresher", () => {
	describe("addTokenHeader", () => {
		it("addTokenHeader should create an init if not provided", () => {
			var expected = {
				headers: {
					Authorization: "Bearer ___token___",
				},
			};

			var token = "___token___";

			expect(JSON.stringify(addTokenHeader(token, undefined))).to.equal(
				JSON.stringify(expected)
			);
		});

		it("addTokenHeader should add headers to init without headers", () => {
			var expected = {
				headers: {
					Authorization: "Bearer ___token___",
				},
			};

			var token = "___token___";

			var input = {};

			expect(JSON.stringify(addTokenHeader(token, input))).to.equal(
				JSON.stringify(expected)
			);
		});

		it("addTokenHeader should add headers to fetch.Headers", () => {
			var input = {
				headers: new fetch.Headers({}),
			};

			var token = "___token___";

			var expected = "Bearer " + token;

			expect(
				(addTokenHeader(token, input).headers as fetch.Headers).get(
					"Authorization"
				)
			).to.equal(expected);
		});
	});
});
