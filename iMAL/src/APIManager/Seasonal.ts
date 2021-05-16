import AnimeNodeSource from "./AnimeNodeSource";
import Authentication from "./Authenticate";
import { Config } from "../Configuration/Config";
import { AnimeNode, Fields } from "./ApiBasicTypes";
import { handleError } from "./ErrorHandler";

type JSONType = {
    data: AnimeNode[];
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

class SeasonalSource implements AnimeNodeSource {
    constructor(
        private year?: number,
        private season?: "winter" | "summer" | "spring" | "fall",
        private fields?: Fields[]
    ) {}

    public async MakeRequest(
        limit?: number,
        offset?: number
    ): Promise<JSONType> {
        let config = await Config.GetInstance();

        let auther = await Authentication.getInstance();
        let stateCode = auther.GetStateCode();
        try {
            let url = `${config.GetApiRoot()}anime/seasonal?season=${
                this.season ? this.season : "summer"
            }&year=${this.year ? this.year : 2021}&state=${stateCode}${
                limit ? "&limit=" + limit : ""
            }${offset ? "&offset=" + offset : ""}&sort=users`;
            if (this.fields) {
                url += `&fields=${this.fields
                    .map((x) => Fields[x])
                    .join(", ")}`;
            }
            let res: Response = await fetch(url);
            let json: JSONType = await res.json();
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
            season: {
                year: -1,
                season: "",
            },
        };
    }
}

export default SeasonalSource;
