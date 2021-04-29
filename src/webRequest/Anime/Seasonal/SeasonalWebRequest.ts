import { Fields } from "../../../helpers/BasicTypes";
import { User } from "../../../models/User";
import { IWebRequest } from "../../IWebRequest";

export class SeasonalWebRequest extends IWebRequest {
	user!: User;
	sort!: "anime_score" | "anime_num_list_users";
	year!: number;
	season!: "summer" | "winter" | "fall" | "spring";
	limit?: number | undefined;
	offset?: number | undefined;
	fields?: Fields[];
}
