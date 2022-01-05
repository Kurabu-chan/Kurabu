import { User } from "#models/User";

import { IQuery } from "#queries/IQuery";

export class UserStatusQuery extends IQuery {
    user!: User;
}
