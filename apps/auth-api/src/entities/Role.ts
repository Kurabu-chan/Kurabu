// Please note this entity does not define what is actually present in the database, if you want to alter the structure it is required that a migration is made, and only then this interface should be changed.
export interface Role {
    /** uuidv4 Primary Key Unique */
    roleId: string;
    /** Unique */
    name: string;

    createDate: Date;
}

export interface RoleAssignment {
    /** uuidv4 Primary Key Unique */
    roleAssignmentId: string;
    /** uuidv4 Foreign Key */
    roleId: string;
    /** uuidv4 Foreign Key */
    userId: string;

    createDate: Date;
}
