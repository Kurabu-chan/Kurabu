import { Inject, Injectable, ProviderScope, ProviderType } from "@tsed/di";
import { RedirectUri } from "../../entities/RedirectUri";
import { Client } from "../../entities/Client";
import { Repository } from "../../providers/Repository";
import { IQuery, IQueryHandler, IQueryResult } from "../IQuery";

export interface GetClientQuery extends IQuery {
    clientId: string;
}

export interface GetClientQueryResult extends IQueryResult {
    data: (Pick<Client, "clientId" | "name"> & { redirectUris: RedirectUri["b64Uri"][] })
}

export interface GetClientQueryFailureResult extends IQueryResult {
    message: string
}

@Injectable({
    scope: ProviderScope.REQUEST,
    type: ProviderType.SERVICE
})
export class GetClientQueryHandler implements
    IQueryHandler<GetClientQuery, GetClientQueryResult | GetClientQueryFailureResult> {
    constructor(
        @Inject(Repository) private readonly clientRepository: Repository<Client>
    ) {

    }

    async handle(query: GetClientQuery):
        Promise<GetClientQueryResult | GetClientQueryFailureResult> {
        type Res = (Pick<Client, "clientId" | "name"> & { b64Uri: RedirectUri["b64Uri"] })[]

        const res: Res = await this.clientRepository
            .getRepository(Client)
            .where("Client.clientId", "=", query.clientId)
            .leftJoin<RedirectUri>("RedirectUri", function () {
                this.on("Client.clientId", "=", "RedirectUri.clientId");
            })
            .select("Client.clientId", "name", "b64Uri");

        if (res.length === 0) {
            return {
                message: "Client not found",
                success: false,
            };
        }

        const data = {
            clientId: query.clientId,
            name: res[0].name,
            redirectUris: res.map(x => x.b64Uri)
        };

        return {
            data,
            success: true,
        };
    }
}
