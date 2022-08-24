import React from "react";
import Anime from "./ListScreen";
import Manga from "./ListScreenManga";
import { AnimeMangaTabNavigator } from "#comps/AnimeMangaTabNavigator";

export default function ListTabs() {
	return (
		<AnimeMangaTabNavigator anime={Anime} manga={Manga} />
	);
}
