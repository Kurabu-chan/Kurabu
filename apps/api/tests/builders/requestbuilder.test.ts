import { expect } from "chai";
import { RequestBuilder } from "../../src/builders/requests/RequestBuilder";

export function requestBuilder(): void {
    describe("RequestBuilder", () => {
        it("Should build url properly", () => {
            const reqBuilder = new RequestBuilder("https", "google.com");
            const built = reqBuilder.build();
            expect(built.url).to.equal("https://google.com");
        });

        it("Should add body to build result", () => {
            const reqBuilder = new RequestBuilder("https", "google.com");
            const expected = {
                cool: "yeah",
            };
            reqBuilder.setBody(expected as any);

            const built = reqBuilder.build();
            expect(built.url).to.equal("https://google.com");
            expect(JSON.stringify(built.body)).to.equal(JSON.stringify(expected));
        });

        it("Should add headers to build result", () => {
            const reqBuilder = new RequestBuilder("https", "google.com");
            reqBuilder.setHeader("cool", "yeah");
            const built = reqBuilder.build();

            const expected = {
                cool: "yeah",
            };

            expect(built.headers).not.to.equal(undefined);
            expect(JSON.stringify(built.headers)).to.equal(JSON.stringify(expected));
        });

        it("Should add correctly formatted path to built url", () => {
            const reqBuilder = new RequestBuilder("https", "google.com");
            reqBuilder.addPath("/search/");
            const built = reqBuilder.build();

            expect(built.url).to.equal("https://google.com/search");
        });

        it("Should add query parameters", () => {
            const reqBuilder = new RequestBuilder("https", "google.com");
            reqBuilder.setQueryParam("cool", "yeah");
            const built = reqBuilder.build();

            expect(built.url).to.equal("https://google.com?cool=yeah");
        });
    });
}
