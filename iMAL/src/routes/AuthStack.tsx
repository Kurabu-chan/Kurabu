/*
All authentication screen stuff goes here
*/
import { createStackNavigator } from 'react-navigation-stack';
import { NavigationRouteConfigMap, NavigationRoute, NavigationParams, CreateNavigatorConfig, NavigationStackRouterConfig } from 'react-navigation';
import { StackNavigationOptions, StackNavigationProp, StackNavigationConfig } from 'react-navigation-stack/lib/typescript/src/vendor/types';
import Register from './AuthScreens/Register';
import Login from './AuthScreens/Login';
import PreLogin from './AuthScreens/PreLogin';
import Verify from './AuthScreens/Verification';

const screens : NavigationRouteConfigMap<StackNavigationOptions,StackNavigationProp<NavigationRoute<NavigationParams>>,unknown>  = {
    PreLogin: {
        screen: PreLogin
    },
    Login: {
        screen: Login
    },    
    Register: {
        screen: Register
    }, 
    Verify: {
        screen: Verify
    }   
}

const defaultOptions: CreateNavigatorConfig<StackNavigationConfig, NavigationStackRouterConfig, StackNavigationOptions, StackNavigationProp<NavigationRoute<NavigationParams>, NavigationParams>> | undefined = {
    headerMode: "none"
}

const AuthStack = createStackNavigator(screens, defaultOptions);
export default AuthStack;