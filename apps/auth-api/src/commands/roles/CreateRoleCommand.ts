import { Inject, Injectable, ProviderScope, ProviderType } from "@tsed/di";
import { $log } from "@tsed/logger";
import { Role } from "../../entities/Role";
import { Scope } from "../../entities/Scope";
import { Repository } from "../../providers/Repository";
import { ICommand, ICommandHandler, ICommandResult } from "../ICommand";

export interface CreateRoleCommand extends ICommand {
    name: string;
    scopes: string[];
}

export interface CreateRoleCommandResult extends ICommandResult {
    roleId?: string;
}

export interface CreateRoleCommandErrorResult extends ICommandResult {
    message: string;
}

@Injectable({
    scope: ProviderScope.REQUEST,
    type: ProviderType.SERVICE,
})
export class CreateRoleCommandHandler implements
    ICommandHandler<CreateRoleCommand, CreateRoleCommandResult | CreateRoleCommandErrorResult> {
    constructor(
        @Inject(Repository) private readonly roleRepository: Repository<Role>,
        @Inject(Repository) private readonly scopeRepository: Repository<Scope>
    ) {

    }

    async handle(command: CreateRoleCommand):
        Promise<CreateRoleCommandResult | CreateRoleCommandErrorResult> {
        const exists = await this.roleRepository
            .getRepository(Role)
            .where("name", "=", command.name)
            .select("roleId");

        if (exists.length > 0) {
            return {
                message: "Role already exists",
                success: false
            };
        }

        const role = await this.roleRepository.getRepository(Role).insert({
            name: command.name
        }, ["roleId"]);

        if (role.length === 0) {
            $log.error({
                event: "Failed to create role"
            });
            return {
                message: "Database did not insert the role",
                success: false
            };
        }

        const roleId = role[0].roleId;

        const inserts = command.scopes.map(scope => ({
            name: scope,
            roleId,
        }));

        await this.scopeRepository.getRepository(Scope).insert(inserts);

        return {
            roleId,
            success: true,
        };
    }
}
