import { expect } from "chai";
import "chai-as-promised";
import { describe, it } from "mocha";
import { KeyProvider } from "../../src/crypto/KeyProvider";

describe("KeyProvider", keyProviderTest);

function keyProviderTest() {
    it("Shoud load keys from environment variables prefixed with KEY or PASSWORD", () => {
        const envs = [
            "KEY_KEY1",
            "PASSWORD_KEY2",
            "KEY_KEY3",
            "PASSWORD_KEY4"
        ];

        for (const env of envs) {
            process.env[env] = env;
        }

        const keyProvider = new KeyProvider();

        for (const env of envs) {
            expect(keyProvider.getKey(env.split("_")[1]))
                .to.equal(env);

            delete process.env[env];
        }
    });

    it("Should throw for invalid key formatted envs when prefixed with KEY or PASSWORD", () => {
        const invalidEnvs = [
            "KEY_KEY1_A",
            "PASSWORD_KEY2_B",
            "KEY",
            "PASSWORD"
        ];

        for (const env of invalidEnvs) {
            process.env[env] = env;

            expect(() => {
                new KeyProvider();
            }).to.throw(Error, `Invalid key format: ${env}`);

            delete process.env[env];
        }
    });

    it("Should throw for when key formatted env is set to an empty value", () => {
        process.env.KEY_EMPTY = "";

        expect(() => {
            new KeyProvider();
        }).to.throw(Error, "Key value is empty: KEY_EMPTY");

        delete process.env.KEY_EMPTY;
    });

    it("Should throw if a non optional key was not set", () => {
        expect(() => {
            new KeyProvider().getKey("KEY1");
        }).to.throw(Error, "Non-optional key KEY1 not found");
    });

    it("Should throw if a required key was not found", () => {
        expect(() => {
            new KeyProvider().requireKey("KEY1");
        }).to.throw(Error, "Key is not found: KEY1");
    });

    it("Should not throw if a required key was found even if a different casing was used", () => {
        process.env.KEY_KEY1 = "KEY1";
        process.env.KEY_KEY21 = "KEY1";
        process.env.KEY_KEY3 = "KEY1";

        expect(() => {
            new KeyProvider().requireKey("KEY21");
        }, "same casing").not.to.throw();

        expect(() => {
            new KeyProvider().requireKey("key21");
        }, "different casing").not.to.throw();

        delete process.env.KEY_KEY1;

        process.env.KEY_key1 = "KEY1";

        expect(() => {
            new KeyProvider().requireKey("KEY1");
        }, "same casing").not.to.throw();

        expect(() => {
            new KeyProvider().requireKey("key1");
        }, "different casing").not.to.throw();

        delete process.env.KEY_key1;
    });
}
