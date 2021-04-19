import { expect } from "chai";
import { RequestBuilder } from "../../src/builders/requests/RequestBuilder";

export function requestBuilder() {
	describe("RequestBuilder", () => {
		it("Should build url properly", async () => {
			var reqBuilder = new RequestBuilder("https", "google.com");
			var built = reqBuilder.build();
			expect(built.url).to.equal("https://google.com");
		});

		it("Should add body to build result", async () => {
			var reqBuilder = new RequestBuilder("https", "google.com");
			var expected = { cool: "yeah" };
			reqBuilder.setBody(expected as any);

			var built = reqBuilder.build();
			expect(built.url).to.equal("https://google.com");
			expect(JSON.stringify(built.body)).to.equal(JSON.stringify(expected));
		});

		it("Should add headers to build result", async () => {
			var reqBuilder = new RequestBuilder("https", "google.com");
			reqBuilder.setHeader("cool", "yeah");
			var built = reqBuilder.build();

			var expected = { cool: "yeah" };

			expect(built.headers).not.to.be.undefined;
			expect(JSON.stringify(built.headers)).to.equal(JSON.stringify(expected));
		});

		it("Should add correctly formatted path to built url", async () => {
			var reqBuilder = new RequestBuilder("https", "google.com");
			reqBuilder.addPath("/search/");
			var built = reqBuilder.build();

			expect(built.url).to.equal("https://google.com/search");
		});

		it("Should add query parameters", async () => {
			var reqBuilder = new RequestBuilder("https", "google.com");
			reqBuilder.setQueryParam("cool", "yeah");
			var built = reqBuilder.build();

			expect(built.url).to.equal("https://google.com?cool=yeah");
		});
	});
}
