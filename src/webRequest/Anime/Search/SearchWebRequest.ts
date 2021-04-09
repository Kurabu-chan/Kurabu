import { Fields } from "../../../helpers/BasicTypes";
import { User } from "../../../models/User";
import { IWebRequest } from "../../IWebRequest";

export class SearchWebRequest extends IWebRequest {
	user!: User;
	query!: string;
	limit?: number | undefined;
	offset?: number | undefined;
	fields?: Fields[];
}
