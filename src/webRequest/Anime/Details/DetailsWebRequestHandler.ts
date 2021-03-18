import { IWebRequestHandler, IWebRequestResultStatus } from "../../IWebRequest";
import { DetailsWebRequest } from "./DetailsWebRequest";
import { DetailsWebRequestResult } from "./DetailsWebRequestResult";
import { autoInjectable } from "tsyringe";
import { RefreshFetch } from "../../../helpers/refresher";
import { Anime, ErrorResponse, Fields } from "../../../helpers/BasicTypes";

function allFields() {
    let x = []
    for (let index = 0; index < 32; index++) {
        x[index] = index;
    }
    return x;
}

function FieldsToString(fields: Fields[]): string {
    return fields.map<string>((field, index, array) => { return Fields[field] }).join(", ");
}

@autoInjectable()
export class DetailsWebRequestHandler implements IWebRequestHandler<DetailsWebRequest, DetailsWebRequestResult> {
    async handle(query: DetailsWebRequest): Promise<DetailsWebRequestResult> {
        if (!query.fields || query.fields.length === 0) {
            query.fields = allFields();
        }
    
        let url = `https://api.myanimelist.net/v2/anime/${query.animeid}?fields=${FieldsToString(query.fields)}`;
        let data = await RefreshFetch(query.uuid, url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    
        let json: Anime | ErrorResponse = data;
        if ((json as ErrorResponse).error) {
            throw new Error((json as ErrorResponse).error);
        }
        console.log(data);
        return {
            success: IWebRequestResultStatus.SUCCESS,
            anime: (json as Anime)
        }
    }
}