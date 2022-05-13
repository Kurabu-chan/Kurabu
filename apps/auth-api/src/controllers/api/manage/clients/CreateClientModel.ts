import { MaxLength, MinLength, Required } from "@tsed/schema";

export class CreateClientModel {
    @Required()
    @MinLength(3)
    @MaxLength(50)
    name!: string;

    @Required()
    b64RedirectUris!: string[];
}
