import { createStackNavigator } from "@react-navigation/stack";
import Search from "#routes/MainScreens/Search/SearchScreen";
import AnimeDetails from "#routes/MainScreens/AnimeDetails";
import { AnimeNode } from "#api/ApiBasicTypes";
import React from "react";
import Seasonal from "#routes/MainScreens/SeasonalScreen";
import DetailsStackParams from "./DetailsStackParams";

export type SeasonalStackParamList = {
    Seasonal: undefined;
    Details: DetailsStackParams;
};

const Stack = createStackNavigator();
export default function SeasonalStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName="SeasonalScreen">
            <Stack.Screen name="SeasonalScreen" component={Seasonal} />
            <Stack.Screen name="DetailsScreen" component={AnimeDetails} />
        </Stack.Navigator>
    );
}
