import { createStackNavigator } from "@react-navigation/stack";
import Search from "#routes/MainScreens/SearchScreen";
import AnimeDetails from "#routes/MainScreens/AnimeDetails";
import { AnimeNode } from "#api/ApiBasicTypes";
import React from "react";

export type SearchStackParamList = {
    Search: undefined;
    Details: {
        item: number;
    };
};

const Stack = createStackNavigator();
export default function SearchStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName="SearchScreen">
            <Stack.Screen name="SearchScreen" component={Search} />
            <Stack.Screen name="DetailsScreen" component={AnimeDetails} />
        </Stack.Navigator>
    );
}
