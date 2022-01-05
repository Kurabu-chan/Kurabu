import * as crypto from "crypto";
import { Logger } from "@overnightjs/logger";

const digest = "sha512";
function iters(iterations: number | undefined): number {
    if (iterations !== undefined) return 99999;
    return Math.ceil(Math.random() * 5000 + 5000);
}
const keyLength = 1024;

/** Hash a password */
export async function hash(password: string, iteration?: number): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            const salt = crypto.randomBytes(keyLength);
            const iterations = iters(iteration);
            const key = crypto.pbkdf2Sync(password, salt, iterations, keyLength, digest);

            const buffer = Buffer.alloc(keyLength * 2);

            salt.copy(buffer);
            key.copy(buffer, salt.length);

            const hashed = buffer.toString("base64");
            resolve(setIterations(hashed, iterations));
        } catch (e) {
            reject(e);
        }
    });
}

/** Compare a password to a hash and see if they the same */
export async function verify(password: string, hashed: string): Promise<boolean> {
    return new Promise((resolve) => {
        try {
            const iterations = removeIterations(hashed);
            const hashPart = iterations.hash;
            const iterPart = iterations.iters;

            const buff = Buffer.alloc(keyLength * 2, hashPart, "base64");
            const salt = buff.slice(0, keyLength);
            const keyA = buff.slice(keyLength, keyLength * 2);

            const keyB = crypto.pbkdf2Sync(password, salt, iterPart, keyLength, digest);

            resolve(keyA.compare(keyB) === 0);
        } catch (err) {
            Logger.Err("Maybe wrong key was used for Verifyieng :/");
            resolve(false);
        }
    });
}
function removeIterations(hashed: string): { hash: string; iters: number } {
    if (!hashed.startsWith("-"))
        return {
            hash: hashed,
            iters: 99999,
        };

    const sliced = hashed.slice(1);
    const index = sliced.indexOf("-");
    const number = sliced.substr(0, index);

    const newHash = hashed.slice(index + 2);
    const iterations = parseInt(decrypt(number), 10);
    return {
        hash: newHash,
        iters: iterations,
    };
}

function setIterations(hashed: string, iterations: number): string {
    if (iterations === 99999) {
        return hashed;
    }
    return `-${encrypt(iterations.toString())}-${hashed}`;
}

const algorithm = "aes-256-cbc";
const pass = process.env.PASSWORD_ENCR;
const defaultPass = "hnwaxyn781no28yx787n2891xn87d6x230x713x13x";

export function encrypt(text: string): string {
    const key = getKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return encrypted.toString("hex") + iv.toString("hex");
}

export function decrypt(encrypted: string): string {
    const key = getKey();

    // split hash into iv and actual hash
    const bytes = Buffer.from(encrypted, "hex");
    const iv = bytes.slice(bytes.length - 16, bytes.length);
    const encryptedPart = bytes.slice(0, bytes.length - 16);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrpyted = Buffer.concat([decipher.update(encryptedPart), decipher.final()]);

    return decrpyted.toString();
}

function getKey() {
    if (pass !== undefined) {
        return crypto.scryptSync(pass, "salt", 32);
    } else {
        Logger.Warn("Using default pass!");
        return crypto.scryptSync(defaultPass, "salt", 32);
    }
}
