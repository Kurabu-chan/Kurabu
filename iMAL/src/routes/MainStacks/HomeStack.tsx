import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Main from "#routes/MainScreens/Home/HomeScreen";
import AnimeDetails from "#routes/MainScreens/AnimeDetails";
import { AnimeNode } from "#api/ApiBasicTypes";
import HomeTabs from "#routes/MainScreens/Home/HomeTabs";

const Stack = createStackNavigator();
export type HomeStackParamList = {
    Home: undefined;
    Details: {
        item: number;
    };
};

export default function HomeStack(params: any) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName="HomeScreen">
            <Stack.Screen name="HomeScreen" component={HomeTabs} />
            <Stack.Screen name="DetailsScreen" component={AnimeDetails} />
        </Stack.Navigator>
    );
}
