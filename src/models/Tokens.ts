import { Table, Column, Model, DataType,AutoIncrement, AllowNull, PrimaryKey } from 'sequelize-typescript';

@Table
export class Tokens extends Model {
    @AutoIncrement
    @AllowNull(false)
    @PrimaryKey
    @Column
    id!: number;
    
    @AllowNull(true)
    @Column(DataType.TEXT)
    token?: string;
    
    @AllowNull(true)
    @Column(DataType.TEXT)
    refreshtoken?: string;

    @AllowNull(true)
    @Column(DataType.TEXT)
    verifier?: string;

    @AllowNull(true)
    @Column(DataType.TEXT)
    redirect?: string;
}