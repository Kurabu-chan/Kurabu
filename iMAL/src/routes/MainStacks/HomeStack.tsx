import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Main from "#routes/MainScreens/Home/HomeScreen";
import Details from "#routes/MainScreens/Details";
import { MediaNode } from "#api/ApiBasicTypes";
import HomeTabs from "#routes/MainScreens/Home/HomeTabs";
import DetailsStackParams from "./DetailsStackParams";

const Stack = createStackNavigator();
export type HomeStackParamList = {
    Home: undefined;
    Details: DetailsStackParams;
};

export default function HomeStack(params: any) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName="HomeScreen">
            <Stack.Screen name="HomeScreen" component={HomeTabs} />
            <Stack.Screen name="DetailsScreen" component={Details} />
        </Stack.Navigator>
    );
}
