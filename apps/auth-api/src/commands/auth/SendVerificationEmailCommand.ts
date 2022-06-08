import { MailServiceFactory } from "@kurabu/common";
import { Inject, Injectable, ProviderScope, ProviderType } from "@tsed/di";
import { getMailConfiguration, MailConfigurations } from "../../index";
import { User } from "../../entities/User";
import { Repository } from "../../providers/Repository";
import { ICommand, ICommandHandler, ICommandResult } from "../ICommand";

export interface SendVerificationEmailCommand extends ICommand {
    email: string,
    userId: string
}

export interface SendVerificationEmailCommandResult extends ICommandResult {

}

export interface SendVerificationEmailCommandErrorResult extends ICommandResult {
    message: string;
}

@Injectable({
    scope: ProviderScope.REQUEST,
    type: ProviderType.SERVICE,
})
export class SendVerificationEmailCommandHandler implements
    ICommandHandler<SendVerificationEmailCommand,
        SendVerificationEmailCommandResult | SendVerificationEmailCommandErrorResult> {
    constructor(
        @Inject(Repository)
        private readonly userRepository: Repository<User>,
        @Inject(MailServiceFactory)
        private readonly mailServiceFactory: MailServiceFactory
    ) {

    }

    async handle(command: SendVerificationEmailCommand):
        Promise<SendVerificationEmailCommandResult | SendVerificationEmailCommandErrorResult> {

        const code = this.generateCode();

        await this.userRepository
            .getRepository(User)
            .where("userId", "=", command.userId)
            .update("verificationCode", code);

        const mailConfiguration = getMailConfiguration(MailConfigurations.verify);
        const mailService = this.mailServiceFactory.getProvider(mailConfiguration);
        await mailService.sendText(
            command.email,
            "Kurabu email verification",
            `This is the verification code for your kurabu account. \n${code}`);

        return {
            success: true
        };
    }

    private generateCode(): string {
        const length = 6;
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";

        for (let i = 0; i < length; i++) {
            code += charset.charAt(Math.floor(getRandomNumberBetween(0, charset.length - 1)));
        }

        return code;
    }
}

function getRandomNumberBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
