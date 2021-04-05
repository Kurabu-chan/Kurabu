import { Table, Column, Model, DataType, ForeignKey, BelongsTo, CreatedAt, PrimaryKey, UpdatedAt, AllowNull } from 'sequelize-typescript';
import { Tokens } from "./Tokens";


@Table
export class User extends Model {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.UUID)
    id!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    email!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    pass!: string;

    @ForeignKey(() => Tokens)
    @AllowNull(true)
    @Column
    tokensId?: number;

    @BelongsTo(() => Tokens)
    tokens?: Tokens

}