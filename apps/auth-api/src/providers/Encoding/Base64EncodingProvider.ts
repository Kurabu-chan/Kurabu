import { IEncodingProvider } from "./IEncodingProvider";

export class Base64EncodingProvider implements IEncodingProvider {
    async encode(data: Buffer, urlsafe = false): Promise<string> {
        return new Promise((resolve) => {
            let encoding: "base64" | "base64url" = "base64";

            if (urlsafe) {
                encoding = "base64url";
            }

            resolve(data.toString(encoding));
        });
    }
    async decode(data: string, urlsafe = false): Promise<Buffer> {
        return new Promise((resolve) => {
            let encoding: "base64" | "base64url" = "base64";

            if (urlsafe) {
                encoding = "base64url";
            }

            resolve(Buffer.from(data, encoding));
        });
    }
}
