import AuthenticationError from "#errors/Authentication/AuthenticationError";
import {
	AllowNull,
	AutoIncrement,
	Column,
	DataType,
	Model,
	PrimaryKey,
	Table,
} from "sequelize-typescript";

import { User } from "./User";

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

export async function ensureTokensOnUser(user: User): Promise<User> {
	if (user.tokens) return user;

	if (!user.tokensId) {
		//insert tokens
		var userTokens = await Tokens.create();
		await user.update({
			tokensId: userTokens.id,
		});
	}

	var loadedUser = await User.findOne({
		where: { id: user.id },
		include: Tokens,
	});

	if (!loadedUser) throw new AuthenticationError("user doesn't exist");

	return loadedUser;
}
