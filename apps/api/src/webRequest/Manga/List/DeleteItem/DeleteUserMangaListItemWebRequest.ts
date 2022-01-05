import { User } from "#models/User";
import { IWebRequest } from "#webreq/IWebRequest";

export class DeleteUserMangaListItemWebRequest extends IWebRequest {
    mangaId!: number;
    user!: User;
}
