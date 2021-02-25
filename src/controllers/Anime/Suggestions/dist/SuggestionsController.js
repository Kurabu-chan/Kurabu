"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SuggestionsController = void 0;
var core_1 = require("@overnightjs/core");
var Options = require("./SuggestionsControllerOptions");
var StateDecorator_1 = require("../../../decorators/StateDecorator");
var Param = require("../../../decorators/ParamDecorator");
var Suggestions_1 = require("../../../MALWrapper/Anime/Suggestions");
var GLOBALVARS_1 = require("../../../helpers/GLOBALVARS");
//TODO use this everywhere
var SuggestionsController = /** @class */ (function () {
    function SuggestionsController() {
    }
    SuggestionsController.prototype.get = function (req, res, arg) {
        arg.limit;
        if (arg.limit && arg.limit > 100) {
            arg.limit = 100;
        }
        Suggestions_1.GetSuggested(arg.state, arg.limit, arg.offset).then(function (result) {
            res.status(200).json(result);
        })["catch"](function (e) {
            res.status(500).json({
                status: GLOBALVARS_1.ERROR_STATUS,
                message: e.message
            });
        });
    };
    __decorate([
        core_1.Get(Options.ControllerName),
        StateDecorator_1["default"](),
        Param.Param("limit", Param.ParamType.int, true),
        Param.Param("offset", Param.ParamType.int, true)
    ], SuggestionsController.prototype, "get");
    SuggestionsController = __decorate([
        core_1.Controller(Options.ControllerPath)
    ], SuggestionsController);
    return SuggestionsController;
}());
exports.SuggestionsController = SuggestionsController;
