export const controllerPath = "authed/jwt";
export const controllerName = "verif";
export type Params = {
	uuid: string;
	code: string;
	redirect?: string;
};
