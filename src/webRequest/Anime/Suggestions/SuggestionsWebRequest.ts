import { Fields } from "../../../helpers/BasicTypes";
import { User } from "../../../models/User";
import { IWebRequest } from "../../IWebRequest";

export class SuggestionsWebRequest extends IWebRequest {
	user!: User;
	limit?: number | undefined;
	offset?: number | undefined;
	fields?: Fields[];
}
