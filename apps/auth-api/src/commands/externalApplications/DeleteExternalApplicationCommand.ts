import { Inject, Injectable, ProviderScope, ProviderType } from "@tsed/di";
import { ExternalApplication } from "../../entities/ExternalApplication";
import { Repository } from "../../providers/Repository";
import { ICommand, ICommandHandler, ICommandResult } from "../ICommand";

export interface DeleteExternalApplicationCommand extends ICommand {
    externalApplicationId: string
}

export interface DeleteExternalApplicationCommandResult extends ICommandResult {
    message?: string
}


@Injectable({
    scope: ProviderScope.REQUEST,
    type: ProviderType.SERVICE,
})
export class DeleteExternalApplicationCommandHandler implements
    ICommandHandler<DeleteExternalApplicationCommand, DeleteExternalApplicationCommandResult> {
    constructor(
        @Inject(Repository)
        private readonly externalApplicationRepository: Repository<ExternalApplication>
    ) {

    }

    async handle(command: DeleteExternalApplicationCommand):
        Promise<DeleteExternalApplicationCommandResult> {

        const externalApplicationId = await this.externalApplicationRepository
            .getRepository(ExternalApplication)
            .where("externalApplicationId", "=", command.externalApplicationId)
            .select("externalApplicationId");

        if (externalApplicationId.length === 0) {
            return {
                message: "ExternalApplication does not exist",
                success: false
            };
        }

        await this.externalApplicationRepository.getRepository(ExternalApplication)
            .where("externalApplicationId", "=", command.externalApplicationId).delete();

        return {
            success: true,
        };
    }
}
