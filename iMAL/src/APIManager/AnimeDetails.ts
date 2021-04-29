import { Config } from "../Configuration/Config";
import { Anime } from "./ApiBasicTypes";
import Authentication from "./Authenticate";

export async function GetDetails(animeid: number): Promise<Anime> {
    let config = await Config.GetInstance();
    let auth = await Authentication.getInstance();

    let root = config.GetApiRoot();
    let code = auth.GetStateCode();

    let url = `${root}anime/details?animeid=${animeid}&state=${code}`;
    console.log(url);
    let res = await fetch(url);

    let json: any = await res.json();
    let ret = json as Anime;
    if (ret.id) {
        return ret;
    } else {
        throw json;
    }
}
