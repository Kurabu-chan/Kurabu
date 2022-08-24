import React from "react";
import Anime from "./SearchScreen";
import Manga from "./SearchScreenManga";
import { AnimeMangaTabNavigator } from "#comps/AnimeMangaTabNavigator";


export default function SearchTabs() {
	return (
		<AnimeMangaTabNavigator anime={Anime} manga={Manga} />
	);
}
