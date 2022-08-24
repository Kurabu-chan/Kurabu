import React from "react";
import Anime from "./HomeScreen";
import Manga from "./HomeScreenManga";
import { AnimeMangaTabNavigator } from "#comps/AnimeMangaTabNavigator";


export default function HomeTabs() {
    return (
		<AnimeMangaTabNavigator anime={Anime} manga={Manga} />
    );
}
