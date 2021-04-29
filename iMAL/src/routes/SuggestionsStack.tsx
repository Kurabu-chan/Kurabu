import Suggestions from "./MainScreens/SuggestionsScreen";
import { createStackNavigator } from "@react-navigation/stack";
import AnimeDetails from "./MainScreens/AnimeDetails";
import React from "react";

const Stack = createStackNavigator();
export default function SearchStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName="SuggestionsScreen">
            <Stack.Screen name="SuggestionsScreen" component={Suggestions} />
            <Stack.Screen name="DetailsScreen" component={AnimeDetails} />
        </Stack.Navigator>
    );
}
