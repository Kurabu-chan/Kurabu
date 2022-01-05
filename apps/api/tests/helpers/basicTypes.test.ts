/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from "chai";
import {
    extractFields,
    Fields,
    fieldsToString,
    isErrResp,
    isTokenResponse,
} from "#helpers/BasicTypes";

export function basicTypes(): void {
    describe("Basic Types", () => {
        describe("Fields", () => {
            describe("extractFields", () => {
                it("extractFields should return empty array for empty string", () => {
                    const input = "";

                    const actual = extractFields(input);

                    expect(actual.fields).to.be.an("object").that.is.empty;
                });

                // eslint-disable-next-line max-len
                it("extractFields should return fields array for fields list comma-space seperated", () => {
                    const input = "id, title, synopsis, popularity, updated_at, status";

                    const actual = extractFields(input);

                    expect(actual.fields.id).to.be.true;
                    expect(actual.fields.title).to.be.true;
                    expect(actual.fields.synopsis).to.be.true;
                    expect(actual.fields.popularity).to.be.true;
                    expect(actual.fields.updated_at).to.be.true;
                    expect(actual.fields.status).to.be.true;
                });

                // eslint-disable-next-line max-len
                it("extractFields should return fields array for fields list comma seperated", () => {
                    const input = "id,title,synopsis,popularity,updated_at,status";

                    const actual = extractFields(input);

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
                    const input: Fields[] = [];

                    const actual = fieldsToString(input);

                    expect(actual).to.equal("");
                });

                // eslint-disable-next-line max-len
                it("fieldsToString should return array of fields for comma-space seperated list of some fields", () => {
                    const input = {
                        id: true,
                        nsfw: true,
                        popularity: true,
                    };

                    const actual = fieldsToString(input);

                    expect(actual).to.equal("id,nsfw,popularity");
                });
            });
        });

        describe("Responses", () => {
            describe("isTokenResponse", () => {
                it("isTokenResponse should return false for non token response", () => {
                    const input = {
                        error: "invalid_token",
                        message: "incorrect token or something",
                    };

                    expect(isTokenResponse(input)).to.be.false;
                });

                it("isTokenResponse should return true for token response", () => {
                    const input = {
                        refreshtoken: "blabla123...4",
                        token: "blabla123",
                        tokenType: "bearer",
                    };

                    expect(isTokenResponse(input)).to.be.true;
                });
            });

            describe("isErrResp", () => {
                it("isErrResp should return true for error response", () => {
                    const input = {
                        error: "invalid_token",
                        message: "incorrect token or something",
                    };

                    expect(isErrResp(input)).to.be.true;
                });

                it("isErrResp should return false for non error response", () => {
                    const input = {
                        refreshtoken: "blabla123...4",
                        token: "blabla123",
                        tokenType: "bearer",
                    };

                    expect(isErrResp(input)).to.be.false;
                });
            });
        });
    });
}
