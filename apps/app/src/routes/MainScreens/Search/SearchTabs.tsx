import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Colors } from "#config/Colors";
import Anime from "./SearchScreen";
import Manga from "./SearchScreenManga";
import { createIconAnime, createIconManga } from "#helpers/DefaultIcons";

const Tab = createBottomTabNavigator();

export default function SearchTabs() {
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
                    tabBarIcon: (props: { focused: boolean, color: string, size: number }) => {
                        return createIconAnime(props.size, {
                            color: props.color
                        })
                    }
                }}
            ></Tab.Screen>
            <Tab.Screen
                name="Manga"
                component={Manga}
                options={{
                    tabBarIcon: (props: { focused: boolean, color: string, size: number }) => {
                        return createIconManga(props.size, {
                            color: props.color
                        })
                    }
                }}
            ></Tab.Screen>
        </Tab.Navigator>
    );
}
