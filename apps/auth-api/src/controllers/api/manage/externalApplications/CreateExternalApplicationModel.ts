import { MaxLength, MinLength, Required } from "@tsed/schema";

export class CreateExternalApplicationModel {
    @Required()
    @MinLength(3)
    @MaxLength(50)
    name!: string;

    @Required()
    @MinLength(4)
    b64AuthenticationOptions!: string;
}
