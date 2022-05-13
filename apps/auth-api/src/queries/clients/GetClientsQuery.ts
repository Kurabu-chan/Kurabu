import { Inject, Injectable, ProviderScope, ProviderType } from "@tsed/di";
import { RedirectUri } from "src/entities/RedirectUri";
import { Client } from "../../entities/Client";
import { Repository } from "../../providers/Repository";
import { IQuery, IQueryHandler, IQueryResult } from "../IQuery";

export interface GetClientsQuery extends IQuery {

}

export interface GetClientsQueryResult extends IQueryResult {
    data: unknown
}

@Injectable({
    scope: ProviderScope.REQUEST,
    type: ProviderType.SERVICE
})
export class GetClientsQueryHandler implements
    IQueryHandler<GetClientsQuery, GetClientsQueryResult> {
    constructor(
        @Inject(Repository) private readonly clientRepository: Repository<Client>
    ) {

    }

    async handle(): Promise<GetClientsQueryResult> {
        type Res = (Pick<Client, "clientId" | "name"> & { b64Uri: RedirectUri["b64Uri"] })[]

        const res: Res = await this.clientRepository
            .getRepository(Client)
            .leftJoin<RedirectUri>("RedirectUri", function () {
                this.on("Client.clientId", "=", "RedirectUri.clientId");
            })
            .select("Client.clientId","name", "b64Uri");

        const grouppedRes: Record<string, {
            name: string,
            redirectUris: string[]
        }> = {};

        for (const element of res) {
            if (grouppedRes[element.clientId] === undefined) {
                grouppedRes[element.clientId] = {
                    name: element.name,
                    redirectUris: []
                };
            }

            grouppedRes[element.clientId].redirectUris.push(element.b64Uri);
        }

        const data = Object.entries(grouppedRes).map(x => {
            return {
                clientId: x[0],
                ...x[1]
            };
        });

        return {
            data,
            success: true,
        };
    }
}
