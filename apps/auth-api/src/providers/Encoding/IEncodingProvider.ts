export interface IEncodingProvider {
    encode(data: Buffer): Promise<string>;
    decode(data: string): Promise<Buffer>;
}
