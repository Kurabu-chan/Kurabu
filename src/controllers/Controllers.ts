import { AnimeDetailsController } from "./Anime/Details/AnimeDetailsController";
import { AnimeRankingController } from "./Anime/Ranking/AnimeRankingController";
import { AnimeSearchController } from "./Anime/Search/AnimeSearchController";
import {
	AnimeSeasonalController,
} from "./Anime/Seasonal/AnimeSeasonalController";
import {
	AnimeSuggestionsController,
} from "./Anime/Suggestions/AnimeSuggestionsController";
import { AuthedController } from "./Authed/AuthedController";
import {
	CancelRegisterController,
} from "./Authed/CancelRegister/CancelRegisterController";
import { LoginController } from "./Authed/Login/LoginController";
import { ReAuthController } from "./Authed/ReAuth/ReAuthController";
import { RegisterController } from "./Authed/Register/RegisterController";
import { StatusController } from "./Authed/Status/StatusController";
import { VerifController } from "./Authed/Verif/VerifController";
import { DocsController } from "./DocsController";
import { MangaDetailsController } from "./Manga/Details/MangaDetailsController";
import { MangaRankingController } from "./Manga/Ranking/MangaRankingController";
import { MangaSearchController } from "./Manga/Search/MangaSearchController";
import { AnimeListController } from "./Anime/List/GetMy/AnimeListController";
import { AnimeListItemController } from "./Anime/List/Item/AnimeListItemController";
import { MangaListController } from "./Manga/List/GetMy/MangaListController";
import { MangaListItemController } from "./Manga/List/Item/MangaListItemController";
import { LoginJwtController } from "./Authed/jwt/Login/LoginJwtController";
import { RegisterJwtController } from "./Authed/jwt/Register/RegisterJwtController";
import { VerifJwtController } from "./Authed/jwt/Verif/VerifJwtController";
import {
	CancelRegisterJwtController
} from "./Authed/jwt/CancelRegister/CancelRegisterJwtController";
import ContainerManager from "#helpers/ContainerManager";

const container = ContainerManager.getInstance().container;

export default [
	container.resolve(AnimeListController),
	container.resolve(AnimeListItemController),
	container.resolve(MangaListController),
	container.resolve(MangaListItemController),

	container.resolve(AnimeDetailsController),
	container.resolve(AnimeRankingController),
	container.resolve(AnimeSearchController),
	container.resolve(AnimeSeasonalController),
	container.resolve(AnimeSuggestionsController),

	container.resolve(MangaDetailsController),
	container.resolve(MangaRankingController),
	container.resolve(MangaSearchController),

	container.resolve(CancelRegisterController),
	container.resolve(LoginController),
	container.resolve(RegisterController),
	container.resolve(VerifController),
	container.resolve(StatusController),
	container.resolve(ReAuthController),

	container.resolve(LoginJwtController),
	container.resolve(RegisterJwtController),
	container.resolve(VerifJwtController),

	container.resolve(AuthedController),

	container.resolve(DocsController),
];
