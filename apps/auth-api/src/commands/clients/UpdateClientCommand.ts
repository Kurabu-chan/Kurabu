import { Inject, Injectable, ProviderScope, ProviderType } from "@tsed/di";
import { $log } from "@tsed/logger";
import { Client } from "../../entities/Client";
import { RedirectUri } from "../../entities/RedirectUri";
import { Repository } from "../../providers/Repository";
import { ICommand, ICommandHandler, ICommandResult } from "../ICommand";

export interface UpdateClientCommand extends ICommand {
    clientId: string;
    name: string;
    b64RedirectUris: string[];
}

export interface UpdateClientCommandResult extends ICommandResult {

}

@Injectable({
    scope: ProviderScope.REQUEST,
    type: ProviderType.SERVICE,
})
export class UpdateClientCommandHandler implements
    ICommandHandler<UpdateClientCommand, UpdateClientCommandResult> {
    constructor(
        @Inject(Repository) private readonly clientRepository: Repository<Client>,
        @Inject(Repository) private readonly redirectUriRepository: Repository<RedirectUri>
    ) {

    }

    async handle(command: UpdateClientCommand): Promise<UpdateClientCommandResult> {
        // Get the client
        const client = await this.clientRepository.getRepository(Client)
            .where("clientId", "=", command.clientId)
            .select("*");

        // Check if a client was found
        if (client.length === 0) {
            $log.error({
                event: "Failed to update client"
            });
            return {
                success: false
            };
        }

        const clientId = client[0].clientId;

        // Get the current redirectUris and their ids
        const redirectUris = await this.redirectUriRepository
            .getRepository(RedirectUri)
            .where("clientId", "=", clientId)
            .select("redirectUriId");

        // Filter the redirectUris that should be deleted
        const deletes = redirectUris
            .filter(x => !command.b64RedirectUris.includes(x.redirectUriId))
            .map(x => x.redirectUriId);

        // Filter the redirectUris that should be inserted
        const creates = command.b64RedirectUris
            .filter(x => redirectUris.filter(y => y.redirectUriId === x).length === 0)
            .map(redirectUri => ({
                b64Uri: redirectUri,
                clientId,
            } as Pick<RedirectUri, "clientId" | "b64Uri">));

        // Insert the missing redirectUris
        if (creates.length > 0) {
            await this.redirectUriRepository.getRepository(RedirectUri).insert(creates);
        }

        // Delete all the extra redirectUris
        for (const del of deletes) {
            await this.redirectUriRepository.getRepository(RedirectUri)
                .where("redirectUriId", "=", del).delete();
        }

        // If the name needs to be updated, update it
        if (command.name !== client[0].name) {
            await this.clientRepository.getRepository(Client)
                .where("clientId", "=", clientId).update({
                name: command.name
            });
        }

        return {
            success: true,
        };
    }
}
