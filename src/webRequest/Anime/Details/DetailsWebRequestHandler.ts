import { IWebRequestHandler, IWebRequestResultStatus } from "../../IWebRequest";
import { DetailsWebRequest } from "./DetailsWebRequest";
import { DetailsWebRequestResult } from "./DetailsWebRequestResult";
import { autoInjectable } from "tsyringe";
import { Anime, ErrorResponse, Fields } from "../../../helpers/BasicTypes";
import { baseRequest } from "../../../builders/requests/RequestBuilder";

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
    
        var request = baseRequest()
            .addPath("v2/anime")
            .addPath(query.animeid.toString())
            .setQueryParam("fields", FieldsToString(query.fields))
            .setHeader('Content-Type', 'application/x-www-form-urlencoded')

        let data = await request.refreshRequest(query.uuid);
    
        let json: Anime | ErrorResponse = data;
        if ((json as ErrorResponse).error) {
            throw new Error((json as ErrorResponse).error);
        }

        return {
            success: IWebRequestResultStatus.SUCCESS,
            anime: (json as Anime)
        }
    }
}