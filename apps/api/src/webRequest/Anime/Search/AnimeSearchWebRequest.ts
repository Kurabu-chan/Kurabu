import { Fields } from "#helpers/BasicTypes";
import { User } from "#models/User";

import { IWebRequest } from "#webreq/IWebRequest";

export class AnimeSearchWebRequest extends IWebRequest {
	user!: User;
	query!: string;
	limit?: number | undefined;
	offset?: number | undefined;
	fields?: Fields;
}
