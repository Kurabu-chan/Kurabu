import { Fields } from "../../../helpers/BasicTypes";
import { IWebRequest } from "../../IWebRequest";

export class DetailsWebRequest extends IWebRequest {
    uuid!: string;
    animeid!: number;
    fields?: Fields[] | undefined
}