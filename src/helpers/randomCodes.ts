import * as crypto from "crypto";

function base64URLEncode(buff: Buffer) {
	return buff
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=/g, "");
}

export function isUUID(uuid: string): boolean {
	const stateRe = /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/;
	return (stateRe.exec(uuid)) != null;
}

export function getUUID():string {
	let dt = new Date().getTime();
	const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
		/[xy]/g,
		function (c) {
			// eslint-disable-next-line no-bitwise
			const r = (dt + Math.random() * 16) % 16 | 0;
			dt = Math.floor(dt / 16);
			// eslint-disable-next-line no-bitwise
			return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
		}
	);
	return uuid;
}

export function getPKCE(length: number): string {
	const l = Math.ceil(length / (4 / 3));
	return base64URLEncode(crypto.randomBytes(l));
}

export function makeVerifCode():string {
	const length = 6;
	let result = "";
	const characters = "0123456789";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
