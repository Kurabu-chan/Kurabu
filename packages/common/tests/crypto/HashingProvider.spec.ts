import { expect } from "chai";
import "chai-as-promised";
import { describe, it, beforeEach } from "mocha";
import { HashingProvider } from "../../src/crypto/HashingProvider";

describe("HashingProvider", hashingProviderTest);

function hashingProviderTest() {
    let hashingProvider: HashingProvider;

    beforeEach(() => {
        hashingProvider = new HashingProvider();
    });

    it("Hashing or verifying should throw when no or an empty key is provided", () => {
        const input = "Hello World!";

        const hashed = hashingProvider.hash(input, "testkey");

        expect(() => {
            hashingProvider.hash(input, "");
        }).to.throw();

        expect(() => {
            hashingProvider.verify(input, hashed, "");
        }).to.throw();
    });

    it("Hashing or verifying should not throw when a key is provided", () => {
        const input = "Hello World!";

        const hashed = hashingProvider.hash(input, "actualkey");

        expect(() => {
            hashingProvider.hash(input, "actualkey");
        }).not.to.throw();

        expect(() => {
            hashingProvider.verify(input, hashed, "actualkey");
        }).not.to.throw();
    });

    it("Hashing the same input twice should have different results", () => {
        const input = "Hello World!";

        const hashedOne = hashingProvider.hash(input, "testkey");
        const hashedTwo = hashingProvider.hash(input, "testkey");

        expect(hashedOne).not.to.equal(hashedTwo);
    });

    it("Hashing should allow specifying iterations", () => {
        const input = "Hello World!";

        expect(() => {
            hashingProvider.hash(input, "testkey", 1);
        }).not.to.throw();
    });

    it("Get iterations should return 99999 if an old hash was used", () => {
        const oldhash = "Hello World!";

        const iterations = hashingProvider.getIterations(oldhash, "testkey");
        expect(iterations.iters).to.equal(99999);
    });
}
