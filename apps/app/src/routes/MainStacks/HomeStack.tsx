import Details from "#routes/MainScreens/Details";
import HomeTabs from "#routes/MainScreens/Home/HomeTabs";
import { ListDetails } from "#routes/MainScreens/ListDetails";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import DetailsStackParams from "./DetailsStackParams";
import ListDetailsStackParams from "./ListDetailsStackParams";

const Stack = createStackNavigator();
export type HomeStackParamList = {
    HomeScreen: undefined;
    DetailsScreen: DetailsStackParams;
    ListDetailsScreen: ListDetailsStackParams;
};

export default function HomeStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName="HomeScreen"
        >
            <Stack.Screen name="HomeScreen" component={HomeTabs} />
            <Stack.Screen name="DetailsScreen" component={Details} />
            <Stack.Screen name="ListDetailsScreen" component={ListDetails} />
        </Stack.Navigator>
    );
}
