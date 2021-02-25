"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthedController = void 0;
var core_1 = require("@overnightjs/core");
var logger_1 = require("@overnightjs/logger");
var GLOBALVARS_1 = require("../helpers/GLOBALVARS");
var UserManager_1 = require("../helpers/UserManager");
var RequestHelper_1 = require("../helpers/RequestHelper");
//Main controller
var AuthedController = /** @class */ (function () {
    function AuthedController() {
    }
    //endpoint for logging the code dict to the console
    AuthedController.prototype.logCodeDict = function (req, res) {
        UserManager_1.UserManager.GetInstance().LogDict();
        res.status(200).json({
            status: GLOBALVARS_1.SUCCESS_STATUS,
            message: "Logged succesfully"
        });
    };
    //endpoint for registering a new user
    AuthedController.prototype.Register = function (req, res) {
        //Check if email and password are present
        try {
            var email = RequestHelper_1.BodyOrUrlParams.RequiredString("email", req);
            var pass = RequestHelper_1.BodyOrUrlParams.RequiredString("pass", req);
            UserManager_1.UserManager.GetInstance().StartRegister(email, pass).then(function (uuid) {
                //log that we are starting an auth for an ip with the state
                logger_1.Logger.Info("Starting auth for " + req.ip);
                //send the uuid to the user
                res.status(200).json({
                    status: GLOBALVARS_1.SUCCESS_STATUS,
                    message: uuid
                });
            })["catch"](function (e) {
                res.status(500).json({
                    status: GLOBALVARS_1.ERROR_STATUS,
                    message: e.message
                });
            });
        }
        catch (e) {
            res.status(422).json({
                status: GLOBALVARS_1.ERROR_STATUS,
                message: e.message
            });
        }
    };
    AuthedController.prototype.Verif = function (req, res) {
        try {
            var uuid = RequestHelper_1.BodyOrUrlParams.RequiredString("uuid", req);
            var code = RequestHelper_1.BodyOrUrlParams.RequiredString("code", req);
            var redirect = RequestHelper_1.BodyOrUrlParams.OptionalString("redirect", req);
            var ourdomain = req.protocol + "://" + req.hostname;
            UserManager_1.UserManager.GetInstance().DoVerif(uuid, code, ourdomain, redirect).then(function (url) {
                res.status(200).json({
                    status: GLOBALVARS_1.SUCCESS_STATUS,
                    message: url
                });
            })["catch"](function (e) {
                res.status(500).json({
                    status: GLOBALVARS_1.ERROR_STATUS,
                    message: e.message
                });
            });
        }
        catch (e) {
            res.status(422).json({
                status: GLOBALVARS_1.ERROR_STATUS,
                message: e.message
            });
        }
    };
    //endpoint for canceling register so someone can retry
    AuthedController.prototype.CancelRegister = function (req, res) {
        var uuid = RequestHelper_1.BodyOrUrlParams.RequiredString("uuid", req);
        var result = UserManager_1.UserManager
            .GetInstance()
            .CancelRegister(uuid);
        if (result) {
            res.status(200).json({
                status: GLOBALVARS_1.SUCCESS_STATUS,
                message: "Register canceled successfully"
            });
        }
        else {
            res.status(403).json({
                status: GLOBALVARS_1.ERROR_STATUS,
                message: "There was a problem canceling registration"
            });
        }
    };
    //endpoint for login using email and password, returning error or uuid
    AuthedController.prototype.Login = function (req, res) {
        try {
            var email = RequestHelper_1.BodyOrUrlParams.RequiredString("email", req);
            var pass = RequestHelper_1.BodyOrUrlParams.RequiredString("pass", req);
            UserManager_1.UserManager.GetInstance().Login(email, pass).then(function (result) {
                res.status(200).json({
                    status: GLOBALVARS_1.SUCCESS_STATUS,
                    message: result
                });
            })["catch"](function (e) {
                res.status(403).json({
                    status: GLOBALVARS_1.ERROR_STATUS,
                    message: e.message
                });
            });
        }
        catch (e) {
            res.status(422).json({
                status: GLOBALVARS_1.ERROR_STATUS,
                message: e.message
            });
        }
    };
    //endpoint that gets called when the user clicks either of the buttons on mal
    AuthedController.prototype.authed = function (req, res) {
        //TODO redirect to app instead of returning json
        var stat = UserManager_1.UserManager.CheckRequestState(req, res);
        if (typeof stat === "boolean") {
            return;
        }
        var state = stat;
        if (RequestHelper_1.BodyOrUrlParams.OptionalString("error", req)) {
            logger_1.Logger.Info("Auth ERR for " + state + ": " + req.query.hint);
            UserManager_1.UserManager.GetInstance().SetCanceled(state);
            res.status(200).json({
                status: GLOBALVARS_1.SUCCESS_STATUS,
                message: "authentication for " + state + " has been canceled"
            });
            return;
        }
        //No code defined
        if (!req.query.code) {
            logger_1.Logger.Warn("missing parameter in request to /authed");
            UserManager_1.UserManager.GetInstance().SetErrored(state);
            res.status(422).json({
                status: GLOBALVARS_1.ERROR_STATUS,
                message: "you are missing a required parameter"
            });
            return;
        }
        //strinfiy the code
        var code = String(req.query.code);
        var codeRe = /[0-9a-z]{700,1300}/;
        //code wrong format
        if (!code.match(codeRe)) {
            logger_1.Logger.Warn("Code parameter was of incorrect format in request to /authed");
            UserManager_1.UserManager.GetInstance().SetErrored(state);
            res.status(422).json({
                status: GLOBALVARS_1.ERROR_STATUS,
                message: "There is a problem with one of your parameters"
            });
            return;
        }
        var ourdomain = req.protocol + "://" + req.hostname;
        UserManager_1.UserManager.GetInstance().DoPending(state, code, ourdomain).then(function (redirUrl) {
            console.log();
            res.redirect(redirUrl);
        })["catch"](function (err) {
            res.status(403).json({
                status: GLOBALVARS_1.ERROR_STATUS,
                message: err.message
            });
        });
    };
    __decorate([
        core_1.Get("log")
    ], AuthedController.prototype, "logCodeDict");
    __decorate([
        core_1.Post("register")
    ], AuthedController.prototype, "Register");
    __decorate([
        core_1.Post("verif")
    ], AuthedController.prototype, "Verif");
    __decorate([
        core_1.Post("cancelRegister")
    ], AuthedController.prototype, "CancelRegister");
    __decorate([
        core_1.Post("login")
    ], AuthedController.prototype, "Login");
    __decorate([
        core_1.Get()
    ], AuthedController.prototype, "authed");
    AuthedController = __decorate([
        core_1.Controller('authed')
    ], AuthedController);
    return AuthedController;
}());
exports.AuthedController = AuthedController;
