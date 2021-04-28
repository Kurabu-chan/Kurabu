/*
All authentication screen stuff goes here
*/
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Register from "./AuthScreens/Register";
import Login from "./AuthScreens/Login";
import PreLogin from "./AuthScreens/PreLogin";
import Verify from "./AuthScreens/Verification";

const Stack = createStackNavigator();
export default function MainStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName="PreLogin">
            <Stack.Screen name="PreLogin" component={PreLogin} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Verify" component={Verify} />
        </Stack.Navigator>
    );
}

export type AuthStackParamList = {
    PreLogin: undefined;
    Login: undefined;
    Register: undefined;
    Verify: {
        uuid: string;
    };
};
