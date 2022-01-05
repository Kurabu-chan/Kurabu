import {
    AllowNull,
    BelongsTo,
    Column,
    DataType,
    Default,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from "sequelize-typescript";

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

    @AllowNull(true)
    @Column(DataType.STRING)
    verifCode?: string;

    @AllowNull(true)
    @Default(0)
    @Column
    verifAttemptCount?: number;

    @ForeignKey(() => Tokens)
    @AllowNull(true)
    @Column
    tokensId?: number;

    @BelongsTo(() => Tokens)
    tokens?: Tokens;
}
