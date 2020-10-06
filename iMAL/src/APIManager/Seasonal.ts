import AnimeNodeSource from './AnimeNodeSource';
import Authentication from './Authenticate';
import { AnimeNode } from '../components/AnimeItem';

type JSONType = {
    data: AnimeNode[],
    paging: {
        next?: string,
        previous?: string
    },
    season: {
        year: number,
        season: string
    }
}

function isIterable(obj: any) {
    // checks for null and undefined
    if (obj == null) {
      return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
  }

class SeasonalSource implements AnimeNodeSource{
    private year?: number;
    private season?: "winter" | "summer" | "spring" | "fall";

    constructor(year?: number, season?: "winter" | "summer" | "spring" | "fall") {
        this.year = year;
        this.season = season;
    }

    public async MakeRequest(limit?: number, offset?: number) : Promise<JSONType>{
        let auther = await Authentication.getInstance();
        let stateCode = auther.GetStateCode();
        try {
            let url = `http://api.imal.ml/anime/seasonal?season=${this.season?this.season:"summer"}&year=${this.year?this.year:2020}&state=${stateCode}${limit?"&limit="+limit:""}${offset?"&offset="+offset:""}&sort=users`;
            let res: Response = await fetch(url);
            let json: JSONType = await res.json();
            let ret = (json as JSONType);
            if(ret.data && isIterable(ret.data)){
                return json;
            }else{
                console.log(json);
                throw json;
            }
            
            
        } catch (e) {}

        return {
            data: [],
            paging: {},
            season: {
                year: -1,
                season: ""
            }
        };
    }
}

export default SeasonalSource;