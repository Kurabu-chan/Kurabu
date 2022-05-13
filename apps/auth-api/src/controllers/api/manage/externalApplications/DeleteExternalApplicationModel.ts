import { Required, Pattern } from "@tsed/schema";

export class DeleteExternalApplicationModel {
    @Required()
    @Pattern(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    externalApplicationId!: string;
}
