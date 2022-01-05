import { expect } from "chai";
import { hash, verify, encrypt, decrypt } from "../../src/helpers/Hasher";
import { getPKCE } from "../../src/helpers/randomCodes";

export function hasher(): void {
    describe("Hasher", () => {
        it("Hashing then verifying should return true", async () => {
            const allNonHashed: string[] = [];
            const allHashedPromise: Promise<string>[] = [];
            for (let i = 0; i < 1; i++) {
                const nonhashed = getPKCE(100);
                allNonHashed.push(nonhashed);
                allHashedPromise.push(hash(nonhashed));
            }
            const allHashed = await Promise.all(allHashedPromise);

            const allVerifyPromise: Promise<boolean>[] = [];
            allHashed.forEach((hashed, index) => {
                allVerifyPromise.push(verify(allNonHashed[index], hashed));
            });
            const allVerify = await Promise.all(allVerifyPromise);
            allVerify.forEach((verified) => {
                expect(verified).to.equal(true);
            });
        });

        it("Hashing then verifying an old hash (99999 iters) should return true", async () => {
            const nonhashed = getPKCE(100);
            const hashed = await hash(nonhashed, 99999);
            const verified = await verify(nonhashed, hashed);

            expect(verified).to.equal(true);
        });

        // eslint-disable-next-line max-len
        it("Encrypting then decrypting a string should return the same as the starting string", () => {
            const password = "hey thats very cool";
            const encrypted = encrypt(password);
            const decrypted = decrypt(encrypted);

            expect(password).to.equal(decrypted);
        });
    });
}
