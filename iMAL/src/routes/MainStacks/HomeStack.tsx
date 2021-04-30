import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Main from "#routes/MainScreens/HomeScreen";
import AnimeDetails from "#routes/MainScreens/AnimeDetails";
import { AnimeNode } from "#api/ApiBasicTypes";

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
            initialRouteName="HomeScreen">
            <Stack.Screen name="HomeScreen" component={Main} />
            <Stack.Screen name="DetailsScreen" component={AnimeDetails} />
        </Stack.Navigator>
    );
}
