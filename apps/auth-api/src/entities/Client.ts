import { IEntity } from "./IEntity";

// Please note this entity does not define what is actually present in the database, if you want to alter the structure it is required that a migration is made, and only then this interface should be changed.
export class Client implements IEntity {
    /** uuidv4 Primary Key Unique */
    clientId!: string;

    name!: string;

    createDate!: Date;
}
