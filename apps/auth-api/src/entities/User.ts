// Please note this entity does not define what is actually present in the database, if you want to alter the structure it is required that a migration is made, and only then this interface should be changed.
export interface User {
    /** uuidv4 Primary Key Unique */
    userId: string;
    /** Unique */
    email: string;

    hash: string;

    createDate: Date;
}
