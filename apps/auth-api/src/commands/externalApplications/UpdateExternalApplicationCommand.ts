import { Inject, Injectable, ProviderScope, ProviderType } from "@tsed/di";
import { $log } from "@tsed/logger";
import { ExternalApplication } from "../../entities/ExternalApplication";
import { Repository } from "../../providers/Repository";
import { ICommand, ICommandHandler, ICommandResult } from "../ICommand";

export interface UpdateExternalApplicationCommand extends ICommand {
    externalApplicationId: string;
    name: string;
    b64AuthenticationOptions: string;
}

export interface UpdateExternalApplicationCommandResult extends ICommandResult {
    message?: string;
}

@Injectable({
    scope: ProviderScope.REQUEST,
    type: ProviderType.SERVICE,
})
export class UpdateExternalApplicationCommandHandler implements
    ICommandHandler<UpdateExternalApplicationCommand, UpdateExternalApplicationCommandResult> {
    constructor(
        @Inject(Repository) private readonly externalApplicationRepository:
            Repository<ExternalApplication>
    ) {

    }

    async handle(command: UpdateExternalApplicationCommand):
        Promise<UpdateExternalApplicationCommandResult> {
        // Get the externalApplication
        const externalApplication = await this.externalApplicationRepository
            .getRepository(ExternalApplication)
            .where("externalApplicationId", "=", command.externalApplicationId)
            .select("*");

        // Check if a externalApplication was found
        if (externalApplication.length === 0) {
            $log.error({
                event: "Update for non existing external application"
            });
            return {
                message: "External application does not exist",
                success: false
            };
        }

        // If the name or b64AuthenticationOptions needs to be updated, update it
        if (command.name !== externalApplication[0].name ||
            command.b64AuthenticationOptions !== externalApplication[0].b64AuthenticationOptions) {
            await this.externalApplicationRepository
                .getRepository(ExternalApplication)
                .where("externalApplicationId", "=", command.externalApplicationId)
                .update({
                    b64AuthenticationOptions: externalApplication[0].b64AuthenticationOptions,
                    name: command.name
                });
        }

        return {
            success: true,
        };
    }
}
