import { Fields, MediaNode } from "../ApiBasicTypes";
import Authentication from "../Authenticate";
import { handleError } from "../ErrorHandler";
import { baseRequest } from "#helpers/RequestBuilder";
import MediaNodeSource from "../MediaNodeSource";

type JSONType = {
    data: MediaNode[];
    paging: {
        next?: string;
        previous?: string;
    };
    season: {
        year: number;
        season: string;
    };
};

function isIterable(obj: any) {
    // checks for null and undefined
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === "function";
}

class AnimeSeasonalSource implements MediaNodeSource {
    constructor(
        private year?: number,
        private season?: "winter" | "summer" | "spring" | "fall",
        private fields?: Fields[]
    ) {
        if (!this.fields) {
            this.fields = [Fields.media_type];
        }
    }

    public async MakeRequest(
        limit?: number,
        offset?: number
    ): Promise<JSONType> {
        let auther = await Authentication.getInstance();
        let token = await auther.GetToken();
        try {
            if (!token) throw new Error("We have no token");

            var req = await baseRequest()
                .addPath("anime")
                .addPath("seasonal")
                .setQueryParam("season", this.season ?? "summer")
                .setQueryParam("year", (this.year ?? 2021).toString())
                .setQueryParam("sort", "users")
                .addAuthentication();

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
        } catch (e) { }

        return {
            data: [],
            paging: {},
            season: {
                year: -1,
                season: "",
            },
        };
    }
}

export default AnimeSeasonalSource;
