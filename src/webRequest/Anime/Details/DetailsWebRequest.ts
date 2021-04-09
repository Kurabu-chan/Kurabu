import { Fields } from "../../../helpers/BasicTypes";
import { User } from "../../../models/User";
import { IWebRequest } from "../../IWebRequest";

export class DetailsWebRequest extends IWebRequest {
	user!: User;
	animeid!: number;
	fields?: Fields[] | undefined;
}
