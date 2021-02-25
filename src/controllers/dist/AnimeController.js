"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AnimeController = void 0;
var core_1 = require("@overnightjs/core");
var GLOBALVARS_1 = require("../helpers/GLOBALVARS");
var Details_1 = require("../MALWrapper/Anime/Details");
var Ranking_1 = require("../MALWrapper/Anime/Ranking");
var Search_1 = require("../MALWrapper/Anime/Search");
var Seasonal_1 = require("../MALWrapper/Anime/Seasonal");
var UserManager_1 = require("../helpers/UserManager");
var RequestHelper_1 = require("../helpers/RequestHelper");
//Main controller
var AnimeController = /** @class */ (function () {
    function AnimeController() {
    }
    AnimeController.prototype.search = function (req, res) {
        var stat = UserManager_1.UserManager.CheckRequestState(req, res);
        if (typeof stat === "boolean") {
            return;
        }
        var state = stat;
        var query = RequestHelper_1.BodyOrUrlParams.RequiredString("query", req);
        var limit = RequestHelper_1.BodyOrUrlParams.OptionalInt("limit", req);
        var offset = RequestHelper_1.BodyOrUrlParams.OptionalInt("offset", req);
        if (limit && limit > 100) {
            limit = 100;
        }
        //everything is good        
        Search_1.GetSearch(state, query, limit, offset).then(function (result) {
            res.status(200).json(result);
            //Maybe it isnt :()
        })["catch"](function (e) {
            res.status(500).json({
                status: GLOBALVARS_1.ERROR_STATUS,
                message: e.message
            });
        });
    };
    AnimeController.prototype.details = function (req, res) {
        var stat = UserManager_1.UserManager.CheckRequestState(req, res);
        if (typeof stat === "boolean") {
            return;
        }
        var state = stat;
        var animeid = RequestHelper_1.BodyOrUrlParams.OptionalInt("animeid", req);
        animeid = animeid ? animeid : 1;
        //everything is good        
        Details_1.GetDetails(state, animeid).then(function (result) {
            res.status(200).json(result);
            //Maybe it isnt :()
        })["catch"](function (e) {
            res.status(500).json({
                status: GLOBALVARS_1.ERROR_STATUS,
                message: e.message
            });
        });
    };
    AnimeController.prototype.seasonal = function (req, res) {
        var stat = UserManager_1.UserManager.CheckRequestState(req, res);
        if (typeof stat === "boolean") {
            return;
        }
        var state = stat;
        var year = 2020;
        if (req.query.year) {
            try {
                year = parseInt(req.query.year);
                if (year < 1917) {
                    year = 2020;
                }
                else if (year > 2021) {
                    year = 2020;
                }
            }
            catch (e) { }
        }
        var season = "summer";
        if (req.query.season) {
            try {
                var tempSeason = req.query.season;
                var seasons = ["winter", "spring", "summer", "fall"];
                if (!seasons.includes(tempSeason)) {
                    season = "summer";
                }
                else {
                    season = tempSeason;
                }
            }
            catch (e) {
            }
        }
        var sort = "anime_score";
        if (req.query.sort) {
            try {
                var sortScore = ["score", "animescore", "anime_score"];
                var sortUsers = ["users", "listed", "list_users", "listusers", "anime_num_list_users", "num_list_users", "num_listusers"];
                if (sortScore.includes(req.query.sort)) {
                    sort = "anime_score";
                }
                else if (sortUsers.includes(req.query.sort)) {
                    sort = "anime_num_list_users";
                }
            }
            catch (e) {
            }
        }
        var limit = RequestHelper_1.BodyOrUrlParams.OptionalInt("limit", req);
        var offset = RequestHelper_1.BodyOrUrlParams.OptionalInt("offset", req);
        if (limit && limit > 100) {
            limit = 100;
        }
        //everything is good
        Seasonal_1.GetSeasonal(state, sort, year, season, limit, offset).then(function (result) {
            res.status(200).json(result);
            //Maybe it isnt :()
        })["catch"](function (e) {
            res.status(500).json({
                status: GLOBALVARS_1.ERROR_STATUS,
                message: e.message
            });
        });
    };
    AnimeController.prototype.ranking = function (req, res) {
        var stat = UserManager_1.UserManager.CheckRequestState(req, res);
        if (typeof stat === "boolean") {
            return;
        }
        var state = stat;
        var rankingtype;
        var limit = RequestHelper_1.BodyOrUrlParams.OptionalInt("limit", req);
        var offset = RequestHelper_1.BodyOrUrlParams.OptionalInt("offset", req);
        if (limit && limit > 100) {
            limit = 100;
        }
        if (req.query.rankingtype) {
            var possible = ["all", "airing", "upcoming", "tv", "ova", "movie", "special", "bypopularity", "favorite"];
            if (possible.includes(req.query.rankingtype)) {
                rankingtype = req.query.rankingtype;
            }
        }
        //everything is good
        Ranking_1.GetRanking(state, rankingtype, limit, offset).then(function (result) {
            res.status(200).json(result);
            //Maybe it isnt :()
        })["catch"](function (e) {
            res.status(500).json({
                status: GLOBALVARS_1.ERROR_STATUS,
                message: e.message
            });
        });
    };
    __decorate([
        core_1.Get("search")
    ], AnimeController.prototype, "search");
    __decorate([
        core_1.Get("details")
    ], AnimeController.prototype, "details");
    __decorate([
        core_1.Get("seasonal")
    ], AnimeController.prototype, "seasonal");
    __decorate([
        core_1.Get("ranking")
    ], AnimeController.prototype, "ranking");
    AnimeController = __decorate([
        core_1.Controller('anime')
    ], AnimeController);
    return AnimeController;
}());
exports.AnimeController = AnimeController;
