import { Pattern, Required } from "@tsed/schema";

export class RegisterModel {
    @Required()
    @Pattern(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
    session!: string;

    @Required()
    email!: string;

    @Required()
    pass!: string;
}
