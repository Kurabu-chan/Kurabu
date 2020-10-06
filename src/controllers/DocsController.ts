import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import * as fs from 'fs';
import { resolve } from 'path';

let loaded: string | undefined;

function loadDocs() : string {
    if (!loaded || true) {
        if (fs.existsSync('src/controllers/views/documentation.html')) {
            loaded = fs.readFileSync("src/controllers/views/documentation.html",'utf-8');
        } else {
            console.log("no docs file " + resolve("src/controllers/views/documentation.html"));
            loaded = "no docs";
        }
    }

    return <string>loaded;
}

@Controller('documentation')
export class DocsController {
    @Get("/")
    private GetDocs(req: Request, res: Response) {        
        res.status(200).send(loadDocs());
    }
}
/*
ID: UUID - same as state
Username: varchar
Pass: varchar(hashed)
token: varchar
refreshToken: varchar
*/