import { randomBytes, pbkdf2Sync } from "crypto";
import { EncryptionProvider } from "./EncryptionProvider";

const digest = "sha512";
function iters(iterations: number | undefined): number {
    if (iterations !== undefined) return 99999;
    return Math.ceil(Math.random() * 5000 + 5000);
}
const keyLength = 1024;

export class HashingProvider {
    private encryptionProvider!: EncryptionProvider;

    constructor() {
        this.encryptionProvider = new EncryptionProvider();
    }

    hash(data: string, key: string, iteration?: number): string {
        const salt = randomBytes(keyLength);
        const iterations = iters(iteration);
        const hashResult = pbkdf2Sync(data, salt, iterations, keyLength, digest);

        const buffer = Buffer.alloc(keyLength * 2);

        salt.copy(buffer);
        hashResult.copy(buffer, salt.length);

        const hashed = buffer.toString("base64");
        return this.setIterations(hashed, iterations, key);
    }

    verify(data: string, hashed: string, key: string): boolean {
        const iterations = this.getIterations(hashed, key);
        const hashPart = iterations.hash;
        const iterPart = iterations.iters;

        const buff = Buffer.alloc(keyLength * 2, hashPart, "base64");
        const salt = buff.slice(0, keyLength);
        const keyA = buff.slice(keyLength, keyLength * 2);

        const keyB = pbkdf2Sync(data, salt, iterPart, keyLength, digest);

        return keyA.compare(keyB) === 0;
    }

    getIterations(hashed: string, key: string): { hash: string; iters: number } {
        if (!hashed.startsWith("-"))
            return {
                hash: hashed,
                iters: 99999,
            };

        const sliced = hashed.slice(1);
        const index = sliced.indexOf("-");
        const number = sliced.slice(0, index);

        const newHash = hashed.slice(index + 2);
        const iterations = parseInt(this.encryptionProvider.decrypt(number, key), 10);
        return {
            hash: newHash,
            iters: iterations,
        };
    }

    setIterations(hashed: string, iterations: number, key: string): string {
        if (iterations === 99999) {
            return hashed;
        }
        return `-${this.encryptionProvider.encrypt(iterations.toString(), key)}-${hashed}`;
    }
}
