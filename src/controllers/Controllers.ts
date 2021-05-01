import ContainerManager from "../helpers/ContainerManager";

import { DocsController } from "./DocsController";
import { AnimeDetailsController } from "./Anime/Details/AnimeDetailsController";
import { AnimeRankingController } from "./Anime/Ranking/AnimeRankingController";
import { AnimeSearchController } from "./Anime/Search/AnimeSearchController";
import { AnimeSeasonalController } from "./Anime/Seasonal/AnimeSeasonalController";
import { AnimeSuggestionsController } from "./Anime/Suggestions/AnimeSuggestionsController";
import { AuthedController } from "./Authed/AuthedController";
import { CancelRegisterController } from "./Authed/CancelRegister/CancelRegisterController";
import { RegisterController } from "./Authed/Register/RegisterController";
import { VerifController } from "./Authed/Verif/VerifController";
import { LoginController } from "./Authed/Login/LoginController";
import { StatusController } from "./Authed/Status/StatusController";
import { ReAuthController } from "./Authed/ReAuth/ReAuthController";

var container = ContainerManager.getInstance().Container;

export default [
	container.resolve(AnimeDetailsController),
	container.resolve(AnimeRankingController),
	container.resolve(AnimeSearchController),
	container.resolve(AnimeSeasonalController),
	container.resolve(AnimeSuggestionsController),

	container.resolve(CancelRegisterController),
	container.resolve(LoginController),
	container.resolve(RegisterController),
	container.resolve(VerifController),
	container.resolve(StatusController),
	container.resolve(ReAuthController),

	container.resolve(AuthedController),

	container.resolve(DocsController),
];
