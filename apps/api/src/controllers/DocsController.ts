import * as fs from "fs";
import { Request, Response } from "express";
import { Controller, Get } from "@overnightjs/core";
import { autoInjectable } from "tsyringe";
import { winstonLogger } from "@kurabu/logging";

let loaded: string | undefined;

function loadDocs(): string {
    if (!loaded || true) {
        if (fs.existsSync("src/controllers/views/documentation.html")) {
            loaded = fs.readFileSync("src/controllers/views/documentation.html", "utf-8");
        } else {
            winstonLogger.warn("no docs file");
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
