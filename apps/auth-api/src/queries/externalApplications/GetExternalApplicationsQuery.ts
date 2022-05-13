import { Inject, Injectable, ProviderScope, ProviderType } from "@tsed/di";
import { ExternalApplication } from "../../entities/ExternalApplication";
import { Repository } from "../../providers/Repository";
import { IQuery, IQueryHandler, IQueryResult } from "../IQuery";

const fields = ["name", "b64AuthenticationOptions", "externalApplicationId"] as const;
type Fields = typeof fields[number];


export interface GetExternalApplicationsQuery extends IQuery {

}

export interface GetExternalApplicationsQueryResult extends IQueryResult {
    data: Pick<ExternalApplication, Fields>[]
}

@Injectable({
    scope: ProviderScope.REQUEST,
    type: ProviderType.SERVICE
})
export class GetExternalApplicationsQueryHandler implements
    IQueryHandler<GetExternalApplicationsQuery, GetExternalApplicationsQueryResult> {
    constructor(
        @Inject(Repository) private readonly repository: Repository<ExternalApplication>
    ) {

    }

    async handle(): Promise<GetExternalApplicationsQueryResult> {
        type Res = Pick<ExternalApplication, Fields>[]

        const res: Res = await this.repository.getRepository(ExternalApplication)
            .select(fields);

        return {
            data: res,
            success: true,
        };
    }
}
