import Details from "#routes/MainScreens/Details";
import Seasonal from "#routes/MainScreens/SeasonalScreen";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
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
            initialRouteName="SeasonalScreen"
        >
            <Stack.Screen name="SeasonalScreen" component={Seasonal} />
            <Stack.Screen name="DetailsScreen" component={Details} />
        </Stack.Navigator>
    );
}
