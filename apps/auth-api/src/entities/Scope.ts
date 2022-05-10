import { IEntity } from "./IEntity";

// Please note this entity does not define what is actually present in the database, if you want to alter the structure it is required that a migration is made, and only then this interface should be changed.
export class Scope implements IEntity {
    /** uuidv4 Primary Key Unique */
    scopeId!: string;
    /** uuidv4 Foreign Key */
    roleId!: string;

    name!: string;

    createDate!: Date;
}
