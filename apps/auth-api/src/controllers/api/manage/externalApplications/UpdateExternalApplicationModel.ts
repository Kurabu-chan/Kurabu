import { MaxLength, MinLength, Pattern, Required } from "@tsed/schema";

export class UpdateExternalApplicationModel {
    @Required()
    @Pattern(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    externalApplicationId!: string;

    @Required()
    @MinLength(3)
    @MaxLength(50)
    name!: string;

    @Required()
    @MinLength(4)
    b64AuthenticationOptions!: string;
}
