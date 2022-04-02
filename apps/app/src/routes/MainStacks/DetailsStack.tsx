import { AnimeDetailsMainPicture, AnimeDetailsMediaTypeEnum, MangaDetailsMediaTypeEnum } from "@kurabu/api-sdk";
import { ParamListBase } from "@react-navigation/core";
import { createStackNavigator } from "@react-navigation/stack";
import Details from "#routes/MainScreens/Details/Details";
import { ListDetails } from "#routes/MainScreens/Details/ListDetails";
import React from "react";
import { DetailsImageList } from "#routes/MainScreens/Details/DetailsImageList";
import { DetailsImage } from "#routes/MainScreens/Details/DetailsImage";

export type DetailsParams = {
    id: number;
    mediaType: AnimeDetailsMediaTypeEnum | MangaDetailsMediaTypeEnum;
};

export type ListDetailsParams = {
    id: number;
    mediaType: AnimeDetailsMediaTypeEnum | MangaDetailsMediaTypeEnum;
};

export type DetailsImageListParams = {
    picture: AnimeDetailsMainPicture[]
}

export type DetailsImageParams = {
    picture: AnimeDetailsMainPicture
}

export type DetailsStackParamList = {
    DetailsScreen: DetailsParams;
    ListDetailsScreen: ListDetailsParams;
    DetailsImageListScreen: DetailsImageListParams;
    DetailsImageScreen: DetailsImageParams;
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
                <Stack.Screen name="DetailsImageListScreen" component={DetailsImageList} />
                <Stack.Screen name="DetailsImageScreen" component={DetailsImage} />
            </Stack.Navigator>
        );
    }

    return StackWithDetails;
}