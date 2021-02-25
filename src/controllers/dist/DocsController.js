"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DocsController = void 0;
var core_1 = require("@overnightjs/core");
var fs = require("fs");
var path_1 = require("path");
var loaded;
function loadDocs() {
    if (!loaded || true) {
        if (fs.existsSync('src/controllers/views/documentation.html')) {
            loaded = fs.readFileSync("src/controllers/views/documentation.html", 'utf-8');
        }
        else {
            console.log("no docs file " + path_1.resolve("src/controllers/views/documentation.html"));
            loaded = "no docs";
        }
    }
    return loaded;
}
var DocsController = /** @class */ (function () {
    function DocsController() {
    }
    DocsController.prototype.GetDocs = function (req, res) {
        res.status(200).send(loadDocs());
    };
    __decorate([
        core_1.Get("/")
    ], DocsController.prototype, "GetDocs");
    DocsController = __decorate([
        core_1.Controller('documentation')
    ], DocsController);
    return DocsController;
}());
exports.DocsController = DocsController;
/*
ID: UUID - same as state
Username: varchar
Pass: varchar(hashed)
token: varchar
refreshToken: varchar
*/ 
