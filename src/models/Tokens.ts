import { Table, Column, Model, DataType,AutoIncrement, AllowNull, PrimaryKey } from 'sequelize-typescript';

@Table
export class Tokens extends Model {
    @AutoIncrement
    @AllowNull(false)
    @PrimaryKey
    @Column
    id!: number;
    
    @AllowNull(false)
    @Column(DataType.TEXT)
    token!: string;
    
    @AllowNull(false)
    @Column(DataType.TEXT)
    refreshtoken!: string;
}