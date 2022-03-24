import Details from "#routes/MainScreens/Details";
import ListTabs from "#routes/MainScreens/List/ListTabs";
import { ListDetails } from "#routes/MainScreens/ListDetails";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import DetailsStackParams from "./DetailsStackParams";
import ListDetailsStackParams from "./ListDetailsStackParams";

const Stack = createStackNavigator();
export type ListStackParamList = {
    ListScreen: undefined;
    DetailsScreen: DetailsStackParams;
    ListDetailsScreen: ListDetailsStackParams;
};

export default function ListStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName="ListScreen"
        >
            <Stack.Screen name="ListScreen" component={ListTabs} />
            <Stack.Screen name="DetailsScreen" component={Details} />
            <Stack.Screen name="ListDetailsScreen" component={ListDetails} />
        </Stack.Navigator>
    );
}
