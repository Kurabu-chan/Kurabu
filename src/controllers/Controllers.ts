import ContainerManager from "../helpers/ContainerManager";

import { DocsController } from "./DocsController";
import { DetailsController } from "./Anime/Details/DetailsController";
import { RankingController } from "./Anime/Ranking/RankingController";
import { SearchController } from "./Anime/Search/SearchController";
import { SeasonalController } from "./Anime/Seasonal/SeasonalController";
import { SuggestionsController } from "./Anime/Suggestions/SuggestionsController";
import { AuthedController } from "./Authed/AuthedController";
import { CancelRegisterController } from "./Authed/CancelRegister/CancelRegisterController";
import { RegisterController } from "./Authed/Register/RegisterController";
import { VerifController } from "./Authed/Verif/VerifController";
import { LoginController } from "./Authed/Login/LoginController";
import { StatusController } from "./Authed/Status/StatusController";
import { ReAuthController } from "./Authed/ReAuth/ReAuthController";

var container = ContainerManager.getInstance().Container;

export default [
	container.resolve(DetailsController),
	container.resolve(RankingController),
	container.resolve(SearchController),
	container.resolve(SeasonalController),
	container.resolve(SuggestionsController),

	container.resolve(CancelRegisterController),
	container.resolve(LoginController),
	container.resolve(RegisterController),
	container.resolve(VerifController),
	container.resolve(StatusController),
	container.resolve(ReAuthController),

	container.resolve(AuthedController),

	container.resolve(DocsController),
];
