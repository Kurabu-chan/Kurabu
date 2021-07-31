import { randomBytes } from "crypto";
import { v4, validate} from "uuid";

function base64URLEncode(buff: Buffer) {
	return buff
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=/g, "");
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
	randomBytes(length).map(x => (x*10)/256).forEach((n => {
		str += n.toString();
	}));
	return str;
}

