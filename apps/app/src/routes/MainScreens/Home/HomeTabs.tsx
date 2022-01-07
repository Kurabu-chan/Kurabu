import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Icon } from "react-native-elements";
import { Colors } from "#config/Colors";
import Anime from "./HomeScreen";
import Manga from "./HomeScreenManga";

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveBackgroundColor: Colors.KURABUPINK,
                tabBarInactiveBackgroundColor: Colors.KURABUPURPLE,
                tabBarLabelStyle: {
                    fontFamily: "AGRevueCyr",
                    color: Colors.TEXT,
                    padding: 5,
                    fontSize: 12,
                },
                tabBarStyle: {
                    height: 55,
                    display: "flex"
                },
                headerShown: false
            }}
        >
            <Tab.Screen
                name="Anime"
                component={Anime}
                options={{
                    tabBarIcon: createIconAnime,
                }}
            ></Tab.Screen>
            <Tab.Screen
                name="Manga"
                component={Manga}
                options={{
                    tabBarIcon: createIconManga,
                }}
            ></Tab.Screen>
        </Tab.Navigator>
    );
}

function createIconAnime(props: { focused: boolean; color: string; size: number }) {
    return (
        <Icon
            name="film"
            type="font-awesome-5"
            color={Colors.TEXT}
            style={{
                padding: 0,
            }}
        />
    );
}

function createIconManga(props: { focused: boolean; color: string; size: number }) {
    return (
        <Icon
            name="book"
            type="font-awesome-5"
            color={Colors.TEXT}
            style={{
                padding: 0,
            }}
        />
    );
}
