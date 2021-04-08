import { Table, Column, Model, DataType, ForeignKey, BelongsTo, CreatedAt, PrimaryKey, UpdatedAt, AllowNull, Default } from 'sequelize-typescript';
import { ensureTokensOnUser, Tokens } from "./Tokens";


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
    VerifAttemptCount?: number;

    @ForeignKey(() => Tokens)
    @AllowNull(true)
    @Column
    tokensId?: number;

    @BelongsTo(() => Tokens)
    tokens?: Tokens
}

export enum UserStatus {
    done,
    verif,
    authing,
    tokens
}

export async function getStatus(user: User) : Promise<UserStatus>{
    user = await ensureTokensOnUser(user);

    if(user.verifCode) return UserStatus.verif;
    if(user.tokens && user.tokens.verifier) return UserStatus.authing;
    if(!user.tokens || !user.tokens.token) return UserStatus.tokens;    

    return UserStatus.done;
}