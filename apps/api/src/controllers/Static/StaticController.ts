import { Request, Response } from "express";
import { Controller, Get } from "@overnightjs/core";
import { injectable } from "tsyringe";

const files: Record<string, string> = {
	"privacy": "./files/privacy-policy.html"
};

@Controller("static")
@injectable()
export class StaticController {
    @Get(":file")
	private getStatic(req: Request, res: Response) {
		if ("file" in req.params && req.params.file in files) {
			res.status(200).sendFile(files[req.params.file], {
				root: __dirname
			});
		} else {
			res.status(404);
		}
    }
}

