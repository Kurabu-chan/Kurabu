import { Request, Response } from "express";
import { IQuery } from "#queries/IQuery";

export class CheckRequestStateQuery extends IQuery {
	req!: Request;
	res!: Response;
}
