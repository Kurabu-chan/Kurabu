import { Fields } from "../../../helpers/BasicTypes";
import { User } from "../../../models/User";
import { IWebRequest } from "../../IWebRequest";

export class MangaDetailsWebRequest extends IWebRequest {
	user!: User;
	mangaid!: number;
	fields?: Fields[] | undefined;
}
