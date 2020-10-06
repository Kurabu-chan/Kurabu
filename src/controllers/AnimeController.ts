import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { ERROR_STATUS } from '../helpers/GLOBALVARS';
import { GetSuggested } from '../MALWrapper/Anime/Suggestions';
import { GetDetails } from '../MALWrapper/Anime/Details';
import { GetRanking } from '../MALWrapper/Anime/Ranking';
import { GetSearch } from '../MALWrapper/Anime/Search';
import { GetSeasonal } from '../MALWrapper/Anime/Seasonal';
import { UserManager } from '../helpers/UserManager';
import { BodyOrUrlParams } from '../helpers/RequestHelper';

//Main controller
@Controller('anime')
export class AnimeController {
    @Get("suggestions")
    private Suggestions(req: Request, res: Response) {        
        let stat = UserManager.CheckRequestState(req,res);
        if (typeof stat === "boolean") {
            return;
        }
        let state = <string>stat;
        
        let limit = BodyOrUrlParams.OptionalInt("limit", req);
        let offset = BodyOrUrlParams.OptionalInt("offset", req);
        if (limit && limit > 100) {
            limit = 100;
        }
        
        GetSuggested(state, limit, offset).then((result) => {
            res.status(200).json(result);
        //Maybe it isnt :()
        }).catch((e) => {
            res.status(500).json({
                status: ERROR_STATUS,
                message: e.message
            });
        });      
    }

    @Get("search")
    private search(req: Request, res: Response) {
        let stat = UserManager.CheckRequestState(req,res);
        if (typeof stat === "boolean") {
            return;
        }
        let state = <string>stat;

        let query = BodyOrUrlParams.RequiredString("query", req);
        
        let limit = BodyOrUrlParams.OptionalInt("limit", req);
        let offset = BodyOrUrlParams.OptionalInt("offset", req);
        if (limit && limit > 100) {
            limit = 100;
        }

        //everything is good        
        GetSearch(state,query,limit, offset).then((result) => {            
            res.status(200).json(result);            
        //Maybe it isnt :()
        }).catch((e) => {
            res.status(500).json({
                status: ERROR_STATUS,
                message: e.message
            });
        });        
    }

    @Get("details")
    private details(req: Request, res: Response) {
        let stat = UserManager.CheckRequestState(req,res);
        if (typeof stat === "boolean") {
            return;
        }
        let state = <string>stat;
        
        let animeid = BodyOrUrlParams.OptionalInt("animeid", req);
        animeid = animeid ? animeid : 1;

        //everything is good        
        GetDetails( state, animeid).then((result) => {
            res.status(200).json(result);
        //Maybe it isnt :()
        }).catch((e) => {
            res.status(500).json({
                status: ERROR_STATUS,
                message: e.message
            });
        });
    }

    @Get("seasonal")
    private seasonal(req: Request, res: Response) {
        let stat = UserManager.CheckRequestState(req,res);
        if (typeof stat === "boolean") {
            return;
        }
        let state = <string>stat;

        let year = 2020;
        if (req.query.year) {
            try {
                year = parseInt(<string>req.query.year);
                if (year < 1917) {
                    year = 2020;
                } else if(year > 2021){
                    year = 2020;
                }                
            } catch (e) {}
        }

        let season: "summer" | "winter" | "fall" | "spring" = "summer";
        if (req.query.season) {
            try {
                let tempSeason = <string>req.query.season;
                const seasons = ["winter", "spring", "summer", "fall"];
                if (!seasons.includes(tempSeason)) {
                    season = "summer";
                } else {
                    season = <"summer" | "winter" | "fall" | "spring"> tempSeason;
                }
            } catch (e) {
                
            }
        }

        let sort: "anime_score" | "anime_num_list_users" = "anime_score";
        if (req.query.sort) {
            try {
                const sortScore = ["score", "animescore", "anime_score"];
                const sortUsers = ["users", "listed", "list_users", "listusers", "anime_num_list_users", "num_list_users", "num_listusers"]
                if (sortScore.includes(<string>req.query.sort)) {
                    sort = "anime_score";
                } else if (sortUsers.includes(<string>req.query.sort)) {
                    sort = "anime_num_list_users";
                }
            } catch (e) {
                
            }
        }

        let limit = BodyOrUrlParams.OptionalInt("limit", req);
        let offset = BodyOrUrlParams.OptionalInt("offset", req);
        if (limit && limit > 100) {
            limit = 100;
        }

        //everything is good
        GetSeasonal(state,sort,year,season, limit, offset).then((result) => {
            res.status(200).json(result);
        //Maybe it isnt :()
        }).catch((e) => {
            res.status(500).json({
                status: ERROR_STATUS,
                message: e.message
            });
        });
    }

    @Get("ranking")
    private ranking(req: Request, res: Response) {
        let stat = UserManager.CheckRequestState(req,res);
        if (typeof stat === "boolean") {
            return;
        }
        let state = <string>stat;
        
        let rankingtype: undefined | "all" | "airing" | "upcoming" | "tv" | "ova" | "movie" | "special" | "bypopularity" | "favorite";
        
        let limit = BodyOrUrlParams.OptionalInt("limit", req);
        let offset = BodyOrUrlParams.OptionalInt("offset", req);
        if (limit && limit > 100) {
            limit = 100;
        }

        if (req.query.rankingtype) {
            const possible = ["all", "airing", "upcoming", "tv", "ova", "movie", "special", "bypopularity", "favorite"];
            if (possible.includes(<string>req.query.rankingtype)) {
                rankingtype = <"all" | "airing" | "upcoming" | "tv" | "ova" | "movie" | "special" | "bypopularity" | "favorite">req.query.rankingtype;
            }
        }

        //everything is good
        GetRanking(state,rankingtype,limit,offset).then((result) => {
                res.status(200).json(result);
        //Maybe it isnt :()
        }).catch((e) => {
            res.status(500).json({
                status: ERROR_STATUS,
                message: e.message
            });
        });
    }
}