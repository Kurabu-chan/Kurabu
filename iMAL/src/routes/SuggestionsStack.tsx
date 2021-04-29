import Suggestions from "./MainScreens/SuggestionsScreen";
import { createStackNavigator } from "@react-navigation/stack";
import AnimeDetails from "./MainScreens/AnimeDetails";
import { Colors } from "../Configuration/Colors";
import React from "react";

const Stack = createStackNavigator();
export default function SearchStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName="Suggestions">
            <Stack.Screen name="Suggestions" component={Suggestions} />
            <Stack.Screen name="Details" component={AnimeDetails} />
        </Stack.Navigator>
    );
}
