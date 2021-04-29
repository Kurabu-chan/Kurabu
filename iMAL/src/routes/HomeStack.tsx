import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Main from "./MainScreens/HomeScreen";
import AnimeDetails from "./MainScreens/AnimeDetails";
import { Colors } from "../Configuration/Colors";
import { AnimeNode } from "../APIManager/ApiBasicTypes";

const Stack = createStackNavigator();
export type HomeStackParamList = {
    Home: undefined;
    Details: {
        item: AnimeNode;
    };
};

export default function HomeStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName="Home">
            <Stack.Screen name="Home" component={Main} />
            <Stack.Screen name="Details" component={AnimeDetails} />
        </Stack.Navigator>
    );
}
