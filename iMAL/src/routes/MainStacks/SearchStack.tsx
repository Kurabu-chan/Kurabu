import { createStackNavigator } from "@react-navigation/stack";
import Search from "#routes/MainScreens/Search/SearchTabs";
import Details from "#routes/MainScreens/Details";
import { MediaNode } from "#api/ApiBasicTypes";
import React from "react";
import DetailsStackParams from "./DetailsStackParams";

export type SearchStackParamList = {
    Search: undefined;
    Details: DetailsStackParams;
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
            <Stack.Screen name="DetailsScreen" component={Details} />
        </Stack.Navigator>
    );
}
