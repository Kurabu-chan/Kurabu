import { HashingProvider, KeyProvider } from "@kurabu/common";
import { Inject, Injectable, ProviderScope, ProviderType } from "@tsed/di";
import { User } from "../../entities/User";
import { Repository } from "../../providers/Repository";
import { IQuery, IQueryHandler, IQueryResult } from "../IQuery";

export interface LoginQuery extends IQuery {
    email: string,
    pass: string
}

export interface LoginQueryResult extends IQueryResult {
    data: {
        userId: string
    }
}

export interface LoginQueryFailureResult extends IQueryResult {
    message: string
}

@Injectable({
    scope: ProviderScope.REQUEST,
    type: ProviderType.SERVICE
})
export class LoginQueryHandler implements
    IQueryHandler<LoginQuery, LoginQueryResult | LoginQueryFailureResult> {
    constructor(
        @Inject(Repository) private readonly userRepository: Repository<User>,
        @Inject(HashingProvider) private readonly hashingProvider: HashingProvider,
        @Inject(KeyProvider) private readonly keyProvider: KeyProvider
    ) {

    }

    async handle(query: LoginQuery):
        Promise<LoginQueryResult | LoginQueryFailureResult> {

        const user = await this.userRepository
            .getRepository(User)
            .where("email", "=", query.email)
            .select("userId", "hash");

        if (user.length === 0) {
            return {
                message: "Email or password is incorrect",
                success: false,
            };
        }

        const hash = user[0].hash;
        const encryptionKey = this.keyProvider.getKey("encr");
        const valid = this.hashingProvider.verify(query.pass, hash, encryptionKey);

        if (!valid) {
            return {
                message: "Email or password is incorrect",
                success: false,
            };
        }

        return {
            data: {
                userId: user[0].userId,
            },
            success: true,
        };
    }
}
