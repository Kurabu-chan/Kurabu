import { User } from "#models/User";
import { IWebRequest } from "#webreq/IWebRequest";

export class DeleteUserAnimeListItemWebRequest extends IWebRequest {
    animeId!: number;
    user!: User;
}
