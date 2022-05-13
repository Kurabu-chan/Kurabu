import { Inject, Injectable, ProviderScope, ProviderType } from "@tsed/di";
import { Client } from "../../entities/Client";
import { RedirectUri } from "../../entities/RedirectUri";
import { Repository } from "../../providers/Repository";
import { ICommand, ICommandHandler, ICommandResult } from "../ICommand";

export interface DeleteClientCommand extends ICommand {
    clientId: string
}

export interface DeleteClientCommandResult extends ICommandResult {
    message?: string
}


@Injectable({
    scope: ProviderScope.REQUEST,
    type: ProviderType.SERVICE,
})
export class DeleteClientCommandHandler implements
    ICommandHandler<DeleteClientCommand, DeleteClientCommandResult> {
    constructor(
        @Inject(Repository) private readonly clientRepository: Repository<Client>,
        @Inject(Repository) private readonly scopeRepository: Repository<RedirectUri>
    ) {

    }

    async handle(command: DeleteClientCommand): Promise<DeleteClientCommandResult> {

        const clientId = await this.clientRepository
            .getRepository(Client)
            .where("clientId", "=", command.clientId)
            .select("clientId");

        if (clientId.length === 0) {
            return {
                message: "Client does not exist",
                success: false
            };
        }

        await this.scopeRepository.getRepository(RedirectUri)
            .where("clientId", "=", command.clientId).delete();
        await this.clientRepository.getRepository(Client)
            .where("clientId", "=", command.clientId).delete();

        return {
            success: true,
        };
    }
}
