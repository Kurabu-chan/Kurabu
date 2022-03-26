import fetch, { BodyInit, HeadersInit, Response } from "node-fetch";
import { Config } from "#config/Config";
import Authentication from "#api/Authenticate";

export type RequestBuilderBuildType = {
    url: string;
    method?: string;
    body?: BodyInit;
    headers?: HeadersInit;
};

export class RequestBuilder {
    private headers: {
        key: string;
        value: string;
    }[];
    private queryParams: {
        key: string;
        value: string;
    }[];
    private body?: BodyInit;
    private path: string;

    constructor(private scheme: string, private domain: string) {
        this.path = "";
        this.headers = [];
        this.queryParams = [];
    }

    public setBody(body: BodyInit) {
        this.body = body;

        return this;
    }

    public addPath(path: string) {
        if (!path.endsWith("/")) path += "/";
        if (path.startsWith("/")) path = path.substr(1, path.length - 1);
        this.path += path;

        return this;
    }

    public setHeader(key: string, value: string) {
        this.headers.push({
            key: key,
            value: value,
        });

        return this;
    }

    public setQueryParam(key: string, value: string) {
        this.queryParams.push({
            key: key,
            value: value,
        });

        return this;
    }

    public async addAuthentication() {
        const auth = await Authentication.getInstance();
        const token = await auth.GetToken();

        if (!token) throw new ReferenceError("No token present");
        console.log(token);
        this.setHeader("Authorization", "Bearer " + token);

        return this;
    }

    public build(): RequestBuilderBuildType;
    public build(method?: string): RequestBuilderBuildType;
    public build(method?: string): RequestBuilderBuildType {
        let headers: HeadersInit | undefined;
        if (this.headers.length == 0) {
            headers = undefined;
        } else {
            headers = {};
            for (let i = 0; i < this.headers.length; i++) {
                const header = this.headers[i];
                headers[header.key] = header.value;
            }
        }

        let url = `${this.scheme}://${this.domain}`;
        if (!url.endsWith("/")) url += "/";
        url += this.path;

        url = url.substr(0, url.length - 1); //remove last /

        if (this.queryParams.length !== 0) {
            url += "?";
            for (let i = 0; i < this.queryParams.length; i++) {
                const queryParam = this.queryParams[i];

                if (url.endsWith("?") !== true) url += "&";
                url += `${queryParam.key}=${queryParam.value}`;
            }
        }

        return {
            url: url,
            method: method,
            body: this.body,
            headers: headers,
        };
    }

    public request(): Promise<Response>;
    public request(method?: string): Promise<Response>;
    public request(method?: string): Promise<Response> {
        const buildResult = this.build(method);

        return fetch(buildResult.url, {
            method: buildResult.method,
            body: buildResult.body,
            headers: buildResult.headers,
        });
    }
}
const config: Config = Config.GetInstance();

export function baseRequest() {
    if (!config) throw new Error("config not loaded yet fuck");

    return new RequestBuilder(config.Scheme, config.Domain + config.Root);
}
