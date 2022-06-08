import { Inject, Injectable, ProviderScope, ProviderType } from "@tsed/di";
import { User } from "../../entities/User";
import { Repository } from "../../providers/Repository";
import { IQuery, IQueryHandler, IQueryResult } from "../IQuery";

export interface RegisterQuery extends IQuery {
    email: string,
    pass: string
}

export const noVerifyRegistrationExpirationTime = 1000 * 60 * 10;
export const noVerifyRegistrationExpirationClearNotation = "10min";

export interface RegisterQueryResult extends IQueryResult {

}

export interface RegisterQueryFailureResult extends IQueryResult {
    message: string
}

@Injectable({
    scope: ProviderScope.REQUEST,
    type: ProviderType.SERVICE
})
export class RegisterQueryHandler implements
    IQueryHandler<RegisterQuery, RegisterQueryResult | RegisterQueryFailureResult> {
    constructor(
        @Inject(Repository) private readonly userRepository: Repository<User>,

    ) {

    }

    async handle(query: RegisterQuery):
        Promise<RegisterQueryResult | RegisterQueryFailureResult> {

        const user = await this.userRepository
            .getRepository(User)
            .where("email", "=", query.email)
            .select("userId", "hash", "verificationCompleted", "createDate");

        if (user.length !== 0) {
            if (user[0].verificationCompleted === false) {
                // check when their account was made
                const createDate = user[0].createDate;
                createDate.getTime();
                const now = new Date();
                const diff = now.getTime() - createDate.getTime();
                if (diff <= noVerifyRegistrationExpirationTime) {
                    return {
                        message: "Email in use",
                        success: false,
                    };
                } else {
                    // delete the account and then continue to register
                    await this.userRepository
                        .getRepository(User)
                        .delete()
                        .where("userId", "=", user[0].userId);
                }
            }

            return {
                message: "Email in use",
                success: false,
            };
        }

        // verify password is of sufficient quality
        const passReg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)^[a-zA-Z\d\W]{8,30}$/;
        if (!passReg.exec(query.pass)) {
            return {
                // eslint-disable-next-line max-len
                message: "Insufficient password strength, required length is between 8 and 30, and must contain at least one number, one lowercase letter, one uppercase letter, and one special character",
                success: false,
            };
        }

        return {
            success: true
        };
    }
}
