import { expect } from "chai";
import { describe, it, beforeEach } from "mocha";
import { EncryptionProvider } from "../../src/crypto/EncryptionProvider";

describe("EncryptionProvider", EncryptionProviderTest);

function EncryptionProviderTest() {
    let encryptionProvider: EncryptionProvider;

    beforeEach(() => {
        encryptionProvider = new EncryptionProvider();
    });

    it("Encrypting then decrypting with the same key should return back the input that was given", () => {
        const input = "Hello World!";

        const encrypted = encryptionProvider.encrypt(input, "testkey");
        const decrypted = encryptionProvider.decrypt(encrypted, "testkey");

        expect(decrypted).to.equal(input);
    });

    it("Encrypting then decrypting with a different key should throw", () => {
        const input = "Hello World!";

        const encrypted = encryptionProvider.encrypt(input, "testkey");

        expect(() => {
            encryptionProvider.decrypt(encrypted, "testkeys");
        }).to.throw();
    });

    it("Encrypting two different strings with the same key should result in different outputs", () => {
        const inputOne = "Hello World!";
        const inputTwo = "Hello World!";

        const encryptedOne = encryptionProvider.encrypt(inputOne, "testkey");
        const encryptedTwo = encryptionProvider.encrypt(inputTwo, "testkey");

        expect(encryptedOne).to.not.equal(encryptedTwo);
    });

    it("Encrypting or decrypting should throw when no or an empty key is provided", () => {
        const input = "Hello World!";

        const encrypted = encryptionProvider.encrypt(input, "testkey");

        expect(() => {
            encryptionProvider.encrypt(input, "");
        }, "Encrypt empty key").to.throw();

        expect(() => {
            encryptionProvider.encrypt(input, undefined as any);
        }, "Encrypt undefined key").to.throw();

        expect(() => {
            encryptionProvider.encrypt(input, null as any);
        }, "Encrypt null key").to.throw();


        expect(() => {
            encryptionProvider.decrypt(encrypted, "");
        }, "Decrypt empty key").to.throw();

        expect(() => {
            encryptionProvider.decrypt(encrypted, undefined as any);
        }, "Decrypt undefined key").to.throw();

        expect(() => {
            encryptionProvider.decrypt(encrypted, null as any);
        }, "Decrypt null key").to.throw();
    });
}
