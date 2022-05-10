import { Inject, Injectable, ProviderScope, ProviderType } from "@tsed/di";
import { Role } from "../../entities/Role";
import { Scope } from "../../entities/Scope";
import { Repository } from "../../providers/Repository";
import { IQuery, IQueryHandler, IQueryResult } from "../IQuery";

export interface GetUsersQuery extends IQuery {

}

type UserScopeType = {
    roleId: string
    scopes: string[]
    name: string
}

export interface GetUsersQueryResult extends IQueryResult {
    data: UserScopeType[]
}

@Injectable({
    scope: ProviderScope.REQUEST,
    type: ProviderType.SERVICE
})
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery, GetUsersQueryResult> {
    constructor(
        @Inject(Repository) private readonly repository: Repository<Role>
    ) {

    }

    async handle(): Promise<GetUsersQueryResult> {
        type Res = (Pick<Role, "roleId" | "name"> & { scope: Scope["name"] })[]

        const res: Res = await this.repository.getRepository(Role)
            .leftJoin<Scope>("Scope", function () {
                this.on("Scope.roleId", "=", "Role.roleId");
            }).select("Role.roleId as roleId", "Role.name as name", "Scope.name as scope");

        const grouppedRes: Record<string, {
            name: string,
            scopes: string[]
        }> = {};

        for (const element of res) {
            if (grouppedRes[element.roleId] === undefined) {
                grouppedRes[element.roleId] = {
                    name: element.name,
                    scopes: []
                };
            }

            grouppedRes[element.roleId].scopes.push(element.scope);
        }

        const data = Object.entries(grouppedRes).map(x => {
            return {
                roleId: x[0],
                ...x[1]
            };
        });

        return {
            data,
            success: true,
        };
    }
}
