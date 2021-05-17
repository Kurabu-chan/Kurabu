import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Icon } from "react-native-elements";
import { Colors } from "../../../Configuration/Colors";
import Anime from "./HomeScreen";
import Manga from "./HomeScreenManga";

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeBackgroundColor: Colors.KURABUPINK,
                inactiveBackgroundColor: Colors.KURABUPURPLE,
                labelStyle: {
                    fontFamily: "AGRevueCyr",
                    color: Colors.TEXT,
                    padding: 5,
                    fontSize: 12,
                },
                style: {
                    height: 55,
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
    return (
        <Icon
            name="film"
            type="font-awesome-5"
            color={Colors.TEXT}
            style={{
                padding: 5,
            }}
        />
    );
}

function createIconManga(props: {
    focused: boolean;
    color: string;
    size: number;
}) {
    return (
        <Icon
            name="book"
            type="font-awesome-5"
            color={Colors.TEXT}
            style={{
                padding: 10,
            }}
        />
    );
}
