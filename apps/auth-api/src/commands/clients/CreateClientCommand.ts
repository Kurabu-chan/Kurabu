import { Inject, Injectable, ProviderScope, ProviderType } from "@tsed/di";
import { $log } from "@tsed/logger";
import { Client } from "../../entities/Client";
import { RedirectUri } from "../../entities/RedirectUri";
import { Repository } from "../../providers/Repository";
import { ICommand, ICommandHandler, ICommandResult } from "../ICommand";

export interface CreateClientCommand extends ICommand {
    name: string;
    b64RedirectUris: string[];
}

export interface CreateClientCommandResult extends ICommandResult {
    clientId?: string;
}

export interface CreateClientCommandErrorResult extends ICommandResult {
    message: string;
}

@Injectable({
    scope: ProviderScope.REQUEST,
    type: ProviderType.SERVICE,
})
export class CreateClientCommandHandler implements
    ICommandHandler<CreateClientCommand,
    CreateClientCommandResult | CreateClientCommandErrorResult> {
    constructor(
        @Inject(Repository) private readonly clientRepository: Repository<Client>,
        @Inject(Repository) private readonly redirectUriRepository: Repository<RedirectUri>
    ) {

    }

    async handle(command: CreateClientCommand):
        Promise<CreateClientCommandResult | CreateClientCommandErrorResult> {
        const exists = await this.clientRepository
            .getRepository(Client)
            .where("name", "=", command.name)
            .select("clientId");

        if (exists.length > 0) {
            return {
                message: "Client already exists",
                success: false
            };
        }

        const client = await this.clientRepository.getRepository(Client).insert({
            name: command.name
        }, ["clientId"]);

        if (client.length === 0) {
            $log.error({
                event: "Failed to create client"
            });
            return {
                message: "Database did not insert the client",
                success: false
            };
        }

        const clientId = client[0].clientId;

        const inserts: Pick<RedirectUri, "clientId" | "b64Uri">[] = command.b64RedirectUris
            .map(redirectUri => ({
                b64Uri: redirectUri,
                clientId,
            }));

        await this.redirectUriRepository.getRepository(RedirectUri).insert(inserts);

        return {
            clientId,
            success: true,
        };
    }
}
