import { MaxLength, MinLength, Required } from "@tsed/schema";

export class CreateRoleModel {
    @Required()
    @MinLength(3)
    @MaxLength(50)
    name!: string;

    @Required()
    scopes!: string[];
}
