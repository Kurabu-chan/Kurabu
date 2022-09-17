import React from "react";
import Anime from "./RankingScreen";
import Manga from "./RankingScreenManga";
import { AnimeMangaTabNavigator } from "#comps/AnimeMangaTabNavigator";


export default function RankingTabs() {
	return (
		<AnimeMangaTabNavigator anime={Anime} manga={Manga} />
	);
}
