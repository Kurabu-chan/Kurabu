import AnimeNodeSource from "./AnimeNodeSource";
import Authentication from "./Authenticate";
import { Config } from "../Configuration/Config";
import { AnimeNode } from "./ApiBasicTypes";
import { handleError } from "./ErrorHandler";

type JSONType = {
    data: AnimeNode[];
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

class SuggestionsSource implements AnimeNodeSource {
    public async MakeRequest(
        limit?: number,
        offset?: number
    ): Promise<JSONType> {
        let config = await Config.GetInstance();

        let auther = await Authentication.getInstance();
        let stateCode = auther.GetStateCode();
        try {
            let url = `${config.GetApiRoot()}anime/suggestions?state=${stateCode}${
                limit ? "&limit=" + limit : ""
            }${offset ? "&offset=" + offset : ""}`;
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
        };
    }
}

export default SuggestionsSource;
