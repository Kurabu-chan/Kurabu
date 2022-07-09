import { IEntity } from "./IEntity";

// Please note this entity does not define what is actually present in the database, if you want to alter the structure it is required that a migration is made, and only then this interface should be changed.
export class ExternalApplication implements IEntity {
    /** uuidv4 Primary Key Unique */
    externalApplicationId!: string;
    /** Unique */
    name!: string;

    /** base 64 */
    b64AuthenticationOptions!: string;

    createDate!: Date;
}
