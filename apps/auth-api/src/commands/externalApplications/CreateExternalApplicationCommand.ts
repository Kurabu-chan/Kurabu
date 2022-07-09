import { Inject, Injectable, ProviderScope, ProviderType } from "@tsed/di";
import { $log } from "@tsed/logger";
import { ExternalApplication } from "../../entities/ExternalApplication";
import { Repository } from "../../providers/Repository";
import { ICommand, ICommandHandler, ICommandResult } from "../ICommand";

export interface CreateExternalApplicationCommand extends ICommand {
    name: string;
    b64AuthenticationOptions: string;
}

export interface CreateExternalApplicationCommandResult extends ICommandResult {
    externalApplicationId: string;
}

export interface CreateExternalApplicationCommandErrorResult extends ICommandResult {
    message: string;
}

@Injectable({
    scope: ProviderScope.REQUEST,
    type: ProviderType.SERVICE,
})
export class CreateExternalApplicationCommandHandler implements
    ICommandHandler<CreateExternalApplicationCommand,
    CreateExternalApplicationCommandResult | CreateExternalApplicationCommandErrorResult> {
    constructor(
        @Inject(Repository)
        private readonly externalApplicationRepository: Repository<ExternalApplication>
    ) {

    }

    async handle(command: CreateExternalApplicationCommand):
        Promise<CreateExternalApplicationCommandResult
            | CreateExternalApplicationCommandErrorResult> {
        const exists = await this.externalApplicationRepository
            .getRepository(ExternalApplication)
            .where("name", "=", command.name)
            .select("externalApplicationId");

        if (exists.length > 0) {
            return {
                message: "ExternalApplication already exists",
                success: false
            };
        }

        const externalApplication = await this.externalApplicationRepository
            .getRepository(ExternalApplication).insert({
                b64AuthenticationOptions: command.b64AuthenticationOptions,
                name: command.name,
            }, ["externalApplicationId"]);

        if (externalApplication.length === 0) {
            $log.error({
                event: "Failed to create externalApplication"
            });
            return {
                message: "Database did not insert the externalApplication",
                success: false
            };
        }

        const externalApplicationId = externalApplication[0].externalApplicationId;

        return {
            externalApplicationId,
            success: true,
        };
    }
}
