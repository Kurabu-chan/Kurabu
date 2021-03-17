import { IWebRequest } from "../../IWebRequest";

export class GetTokenWebRequest extends IWebRequest {
    code!: string;
    verifier!: string;
    ourdomain!: string;
}