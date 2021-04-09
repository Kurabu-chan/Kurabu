import { IQuery } from "../../IQuery";
import { Request, Response } from "express";

export class CheckRequestStateQuery extends IQuery {
	req!: Request;
	res!: Response;
}
