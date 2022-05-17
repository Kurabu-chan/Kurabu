import { Const, Format, Pattern, Required } from "@tsed/schema";

export class AuthorizeModel {
    @Required()
    @Pattern(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    clientId!: string;

    @Required()
    @Format("uri")
    redirectUri!: string;

    @Required()
    @Const("code")
    responseType!: string;

    @Required()
    @Pattern(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    state!: string;
}
