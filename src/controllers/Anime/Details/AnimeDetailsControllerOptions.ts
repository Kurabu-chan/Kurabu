import { SwaggerDefinitionConstant } from "swagger-express-ts";
import { User } from "#models/User";

export const controllerPath = "anime";
export const controllerName = "details";
export const fullPath = "/" + controllerPath + "/" + controllerName;
export const paramDocs = {
	animeid: {
		description: "The id of the anime you want the details of",
		example: 0,
		required: true,
		type: SwaggerDefinitionConstant.INTEGER
	},
	fields: {
		description: "The fields you want to get from the anime.",
		example: "id, title, main_picture, alternative_titles",
		required: false,
		type: SwaggerDefinitionConstant.STRING
	},
	state: {
		description: "The code used for authentication",
		example: "456c17be-29e9-4b38-afde-8e67110d0bcb",
		required: true,
		type: SwaggerDefinitionConstant.STRING
	},
};


export class AnimeDetailsParams {
	state!: string;
	animeid?: number;
	fields?: string;
	user!: User;
}
