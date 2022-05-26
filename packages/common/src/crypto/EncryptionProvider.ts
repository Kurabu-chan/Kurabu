import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";


const algorithm = "aes-256-cbc";

export class EncryptionProvider {
    constructor() {

    }

    encrypt(text: string, key: string): string {
        if (key === "") throw new Error("Key cannot be empty");

        const cipherKey = scryptSync(key, "salt", 32);
        const iv = randomBytes(16);
        const cipher = createCipheriv(algorithm, cipherKey, iv);

        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
        return encrypted.toString("hex") + iv.toString("hex");
    }
    decrypt(encrypted: string, key: string): string {
        if (key === "") throw new Error("Key cannot be empty");

        const cipherKey = scryptSync(key, "salt", 32);

        // split hash into iv and actual hash
        const bytes = Buffer.from(encrypted, "hex");
        const iv = bytes.slice(bytes.length - 16, bytes.length);
        const encryptedPart = bytes.slice(0, bytes.length - 16);

        const decipher = createDecipheriv(algorithm, cipherKey, iv);
        const decrpyted = Buffer.concat([decipher.update(encryptedPart), decipher.final()]);

        return decrpyted.toString();
    }
}
