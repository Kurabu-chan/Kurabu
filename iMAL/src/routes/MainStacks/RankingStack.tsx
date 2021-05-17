import { createStackNavigator } from "@react-navigation/stack";
import Search from "#routes/MainScreens/Search/SearchScreen";
import Details from "#routes/MainScreens/Details";
import { MediaNode } from "#api/ApiBasicTypes";
import React from "react";
import Ranking from "#routes/MainScreens/Ranking/RankingTabs";
import DetailsStackParams from "./DetailsStackParams";

export type RankingStackParamList = {
    Ranking: undefined;
    Details: DetailsStackParams;
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
            <Stack.Screen name="DetailsScreen" component={Details} />
        </Stack.Navigator>
    );
}
