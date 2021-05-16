import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Anime from "./RankingScreen";
import Manga from "./RankingScreenManga";
import { Colors } from "../../../Configuration/Colors";
import { View, Text } from "react-native";
import { Icon } from "react-native-elements";

const Tab = createBottomTabNavigator();

export default function RankingTabs() {
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeBackgroundColor: Colors.KURABUPURPLE,
                inactiveBackgroundColor: Colors.KURABUPINK,
                labelStyle: {
                    fontFamily: "AGRevueCyr",
                    color: Colors.TEXT,
                },
            }}>
            <Tab.Screen
                name="Anime"
                component={Anime}
                options={{
                    tabBarIcon: createIconAnime,
                }}></Tab.Screen>
            <Tab.Screen
                name="Manga"
                component={Manga}
                options={{
                    tabBarIcon: createIconManga,
                }}></Tab.Screen>
        </Tab.Navigator>
    );
}

function createIconAnime(props: {
    focused: boolean;
    color: string;
    size: number;
}) {
    return <Icon name="film" type="font-awesome-5" color={Colors.TEXT} />;
}

function createIconManga(props: {
    focused: boolean;
    color: string;
    size: number;
}) {
    return <Icon name="book" type="font-awesome-5" color={Colors.TEXT} />;
}
