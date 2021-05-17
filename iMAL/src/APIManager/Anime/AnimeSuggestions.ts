import { Fields, MediaNode } from "../ApiBasicTypes";
import Authentication from "../Authenticate";
import { handleError } from "../ErrorHandler";
import { baseRequest } from "../helper/RequestBuilder";
import MediaNodeSource from "../MediaNodeSource";

type JSONType = {
    data: MediaNode[];
    paging: {
        next?: string;
        previous?: string;
    };
};

function isIterable(obj: any) {
    // checks for null and undefined
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === "function";
}

class AnimeSuggestionsSource implements MediaNodeSource {
    constructor(private fields?: Fields[]) {
        if (!this.fields) {
            this.fields = [Fields.media_type];
        }
    }

    public async MakeRequest(
        limit?: number,
        offset?: number
    ): Promise<JSONType> {
        let auther = await Authentication.getInstance();
        let stateCode = auther.GetStateCode();
        try {
            if (!stateCode) throw new Error("We have no state code");

            var req = baseRequest()
                .addPath("anime")
                .addPath("suggestions")
                .setQueryParam("state", stateCode);

            if (limit) {
                req.setQueryParam("limit", limit.toString());
            }
            if (offset) {
                req.setQueryParam("offset", offset.toString());
            }

            if (this.fields) {
                if (!this.fields.includes(Fields.media_type))
                    this.fields.push(Fields.media_type);
                req.setQueryParam(
                    "fields",
                    this.fields.map((x) => Fields[x]).join(", ")
                );
            }

            console.log(req.build().url);

            let res = await req.request();
            let json: any = await res.json();

            handleError(json);
            let ret = json as JSONType;
            if (ret.data && isIterable(ret.data)) {
                return json;
            } else {
                console.log(json);
                throw json;
            }
        } catch (e) {}

        return {
            data: [],
            paging: {},
        };
    }
}

export default AnimeSuggestionsSource;
