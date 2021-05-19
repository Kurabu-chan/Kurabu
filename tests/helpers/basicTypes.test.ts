import { expect } from "chai";
import {
	extractFields,
	Fields,
	fieldsToString,
	isErrResp,
	isTokenResponse,
} from "../../src/helpers/BasicTypes";

export function basicTypes() {
	describe("Basic Types", () => {
		describe("Fields", () => {
			describe("extractFields", () => {
				it("extractFields should return empty array for empty string", () => {
					let input = "";

					let actual = extractFields(input);

					expect(actual.fields).to.be.an("object").that.is.empty;
				});

				it("extractFields should return fields array for fields list comma-space seperated", () => {
					let input = "id, title, synopsis, popularity, updated_at, status";

					let actual = extractFields(input);

					expect(actual.fields.id).to.be.true;
					expect(actual.fields.title).to.be.true;
					expect(actual.fields.synopsis).to.be.true;
					expect(actual.fields.popularity).to.be.true;
					expect(actual.fields.updated_at).to.be.true;
					expect(actual.fields.status).to.be.true;
				});

				it("extractFields should return fields array for fields list comma seperated", () => {
					let input = "id,title,synopsis,popularity,updated_at,status";

					let actual = extractFields(input);

					expect(actual.fields.id).to.be.true;
					expect(actual.fields.title).to.be.true;
					expect(actual.fields.synopsis).to.be.true;
					expect(actual.fields.popularity).to.be.true;
					expect(actual.fields.updated_at).to.be.true;
					expect(actual.fields.status).to.be.true;
				});
			});

			describe("fieldsToString", () => {
				it("fieldsToString should return empty string for empty array", () => {
					let input: Fields[] = [];

					let actual = fieldsToString(input);

					expect(actual).to.equal("");
				});

				it("fieldsToString should return array of fields for comma-space seperated list of some fields", () => {
					let input = { id: true, nsfw: true, popularity: true };

					let actual = fieldsToString(input);

					expect(actual).to.equal("id,nsfw,popularity");
				});
			});
		});

		describe("Responses", () => {
			describe("isTokenResponse", () => {
				it("isTokenResponse should return false for non token response", () => {
					var input = {
						error: "invalid_token",
						message: "incorrect token or something",
					};

					expect(isTokenResponse(input)).to.be.false;
				});

				it("isTokenResponse should return true for token response", () => {
					var input = {
						token_type: "bearer",
						token: "blabla123",
						refreshtoken: "blabla123...4",
					};

					expect(isTokenResponse(input)).to.be.true;
				});
			});

			describe("isErrResp", () => {
				it("isErrResp should return true for error response", () => {
					var input = {
						error: "invalid_token",
						message: "incorrect token or something",
					};

					expect(isErrResp(input)).to.be.true;
				});

				it("isErrResp should return false for non error response", () => {
					var input = {
						token_type: "bearer",
						token: "blabla123",
						refreshtoken: "blabla123...4",
					};

					expect(isErrResp(input)).to.be.false;
				});
			});
		});
	});
}
