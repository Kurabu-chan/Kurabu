import Suggestions from "#routes/MainScreens/SuggestionsScreen";
import { createStackNavigator } from "@react-navigation/stack";
import Details from "#routes/MainScreens/Details";
import React from "react";
import DetailsStackParams from "./DetailsStackParams";

export type SuggestedStackParamList = {
    Seasonal: undefined;
    Details: DetailsStackParams;
};

const Stack = createStackNavigator();
export default function SearchStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName="SuggestionsScreen">
            <Stack.Screen name="SuggestionsScreen" component={Suggestions} />
            <Stack.Screen name="DetailsScreen" component={Details} />
        </Stack.Navigator>
    );
}
