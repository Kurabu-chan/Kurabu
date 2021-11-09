import * as fs from "fs";
import { resolve } from "path";
import { Request, Response } from "express";
import { Controller, Get } from "@overnightjs/core";
import { autoInjectable } from "tsyringe";
import { Logger } from "@overnightjs/logger";

let loaded: string | undefined;

function loadDocs(): string {
	if (!loaded || true) {
		if (fs.existsSync("src/controllers/views/documentation.html")) {
			loaded = fs.readFileSync(
				"src/controllers/views/documentation.html",
				"utf-8"
			);
		} else {
			Logger.Warn("no docs file " + resolve("src/controllers/views/documentation.html"));
			loaded = "no docs";
		}
	}

	return loaded;
}

@Controller("documentation")
@autoInjectable()
export class DocsController {
	@Get("/")
	private getDocs(req: Request, res: Response) {
		res.status(200).send(loadDocs());
	}
}