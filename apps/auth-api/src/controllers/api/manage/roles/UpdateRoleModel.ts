import { MaxLength, MinLength, Pattern, Required } from "@tsed/schema";

export class UpdateRoleModel {
    @Required()
    @Pattern(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    roleId!: string;

    @Required()
    @MinLength(3)
    @MaxLength(50)
    name!: string;

    @Required()
    scopes!: string[];
}
