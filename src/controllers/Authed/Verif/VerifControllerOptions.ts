export const controllerPath = "authed";
export const controllerName = "verif";
export type Params = {
	uuid: string;
	code: string;
	redirect?: string;
};
