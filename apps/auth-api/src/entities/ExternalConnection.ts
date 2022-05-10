import { IEntity } from "./IEntity";

// Please note this entity does not define what is actually present in the database, if you want to alter the structure it is required that a migration is made, and only then this interface should be changed.
export class ExternalConnection implements IEntity {
    /** uuidv4 Primary Key Unique */
    externalConnectionId!: string;
    /** uuidv4 Foreign Key */
    userId!: string;
    /** uuidv4 Foreign Key */
    externalApplicationId!: string;

    accessToken!: string;

    refreshToken!: string;

    accessTokenExpiresAt!: Date;

    refreshTokenExpiresAt!: Date;

    createDate!: Date;
}
