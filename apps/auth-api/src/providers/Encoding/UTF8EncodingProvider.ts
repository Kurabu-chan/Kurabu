import { IEncodingProvider } from "./IEncodingProvider";

export class UTF8EncodingProvider implements IEncodingProvider {
    async encode(data: Buffer): Promise<string> {
        return new Promise((resolve) => {
            resolve(data.toString("utf-8"));
        });
    }
    async decode(data: string): Promise<Buffer> {
        return new Promise((resolve) => {
            resolve(Buffer.from(data, "utf-8"));
        });
    }
}
