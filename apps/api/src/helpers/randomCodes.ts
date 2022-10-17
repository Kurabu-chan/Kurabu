import { randomBytes } from "crypto";
import { v4, validate } from "uuid";
import {  } from "jsonwebtoken";

function base64URLEncode(buff: Buffer) {
    return buff.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export function isUUID(uuid: string): boolean {
    return validate(uuid);
}

export function getUUID(): string {
    return v4();
}

export function getPKCE(length: number): string {
    const l = Math.ceil(length / (4 / 3));
    return base64URLEncode(randomBytes(l));
}

export function makeVerifCode(): string {
    const length = 6;
    let str = "";
    for (let i = 0; i < length; i++) {
        str += getRandomInt(3, 12) - 3;
    }
    return str;
}

function getRandomInt(min: number, max: number): number {
    // Create byte array and fill with 1 random number
    const byteArray = randomBytes(1);

    const range = max - min + 1;
    const maxRange = 256;
    if (byteArray[0] >= Math.floor(maxRange / range) * range) return getRandomInt(min, max);
    return min + (byteArray[0] % range);
}
