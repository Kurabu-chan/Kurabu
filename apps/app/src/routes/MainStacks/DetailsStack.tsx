import { AnimeDetailsMediaTypeEnum, MangaDetailsMediaTypeEnum } from "@kurabu/api-sdk";
import { ParamListBase } from "@react-navigation/core";
import { createStackNavigator } from "@react-navigation/stack";
import Details from "#routes/MainScreens/Details";
import { ListDetails } from "#routes/MainScreens/ListDetails";
import React from "react";

export type DetailsParams = {
    id: number;
    mediaType: AnimeDetailsMediaTypeEnum | MangaDetailsMediaTypeEnum;
};

export type ListDetailsParams = {
    id: number;
    mediaType: AnimeDetailsMediaTypeEnum | MangaDetailsMediaTypeEnum;
};

export type DetailsStackParamList = {
    DetailsScreen: DetailsParams;
    ListDetailsScreen: ListDetailsParams;
}

export type ParamListWithDetails<ParamList extends ParamListBase> = DetailsStackParamList & ParamList;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createStackWithDetails<ParamList extends ParamListBase>(screenName: Extract<keyof ParamList, string> & keyof ParamList, component: React.ComponentType<any>) {    
    const Stack = createStackNavigator<ParamListWithDetails<ParamList>>();

    function StackWithDetails() {
        return (
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
                initialRouteName={screenName}
            >
                <Stack.Screen name={screenName} component={component} />
                <Stack.Screen name="DetailsScreen" component={Details} />
                <Stack.Screen name="ListDetailsScreen" component={ListDetails} />
            </Stack.Navigator>
        );
    }

    return StackWithDetails;
}