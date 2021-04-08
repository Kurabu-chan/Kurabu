import { Table, Column, Model, DataType,AutoIncrement, AllowNull, PrimaryKey } from 'sequelize-typescript';
import AuthenticationError from '../errors/Authentication/AuthenticationError';
import { User } from './User';

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

export async function ensureTokensOnUser(user: User) : Promise<User>{
    if(user.tokens) return user;

    var loadedUser = await User.findOne({
        where: {id: user.id},
        include: {
            model: Tokens,
            attributes: ["id", "token", "refreshtoken", "verifier", "redirect"]
        }
    });

    if(!loadedUser) throw new AuthenticationError("user doesn't exist");

    return loadedUser;
}