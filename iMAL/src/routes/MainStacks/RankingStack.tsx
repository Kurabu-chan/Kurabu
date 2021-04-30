import { createStackNavigator } from "@react-navigation/stack";
import Search from "#routes/MainScreens/SearchScreen";
import AnimeDetails from "#routes/MainScreens/AnimeDetails";
import { AnimeNode } from "#api/ApiBasicTypes";
import React from "react";
import Ranking from "#routes/MainScreens/RankingScreen";

export type SearchStackParamList = {
    Ranking: undefined;
    Details: {
        item: AnimeNode;
    };
};

const Stack = createStackNavigator();
export default function RankingStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName="RankingScreen">
            <Stack.Screen name="RankingScreen" component={Ranking} />
            <Stack.Screen name="DetailsScreen" component={AnimeDetails} />
        </Stack.Navigator>
    );
}
