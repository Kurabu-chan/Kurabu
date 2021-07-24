import { RefreshFetch } from "#helpers/refresher";
import { User } from "#models/User";
import fetch, {
	BodyInit,
	HeadersInit,
	Response,
} from "node-fetch";

export type RequestBuilderBuildType = {
	url: string;
	method?: string;
	body?: BodyInit;
	headers?: HeadersInit;
};

export class RequestBuilder {
	private headers: { key: string; value: string }[];
	private queryParams: { key: string; value: string }[];
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
			key,
			value,
		});

		return this;
	}

	public setQueryParam(key: string, value: string) {
		this.queryParams.push({
			key,
			value,
		});

		return this;
	}

	public build(method?: string): RequestBuilderBuildType {
		let headers: HeadersInit | undefined;
		if (this.headers.length === 0) {
			headers = undefined;
		} else {
			headers = {};
			for (const header of this.headers) {
				headers[header.key] = header.value;
			}
		}

		let url: string = `${this.scheme}://${this.domain}/${this.path}`;
		url = url.substr(0, url.length - 1); // remove last /

		if (this.queryParams.length !== 0) {
			url += "?";
			for (const queryParam of this.queryParams) {
				if (url.endsWith("?") !== true) url += "&";
				url += `${queryParam.key}=${queryParam.value}`;
			}
		}

		return {
			body: this.body,
			headers,
			method,
			url,
		};
	}

	public request(method?: string): Promise<Response> {
		const buildResult = this.build(method);

		return fetch(buildResult.url, {
			body: buildResult.body,
			headers: buildResult.headers,
			method: buildResult.method,
		});
	}

	public refreshRequest(user: User, method?: string): Promise<any> {
		const buildResult = this.build(method);

		return RefreshFetch(user, buildResult.url, {
			body: buildResult.body,
			headers: buildResult.headers,
			method: buildResult.method,
		});
	}
}

export function baseRequest() {
	return new RequestBuilder("https", "api.myanimelist.net");
}
