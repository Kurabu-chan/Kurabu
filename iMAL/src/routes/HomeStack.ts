import { createStackNavigator } from 'react-navigation-stack';
import { NavigationRouteConfigMap, NavigationRoute, NavigationParams, CreateNavigatorConfig, NavigationStackRouterConfig } from 'react-navigation';
import Main from './MainScreens/HomeScreen';
import { StackNavigationOptions, StackNavigationProp, StackNavigationConfig } from 'react-navigation-stack/lib/typescript/src/vendor/types';
import AnimeDetails from './MainScreens/AnimeDetails';

const screens : NavigationRouteConfigMap<StackNavigationOptions,StackNavigationProp<NavigationRoute<NavigationParams>>,unknown>  = {
    Home: {
        screen: Main
    },
    Details: {
        screen: AnimeDetails
    }
}

const defaultOptions: CreateNavigatorConfig<StackNavigationConfig, NavigationStackRouterConfig, StackNavigationOptions, StackNavigationProp<NavigationRoute<NavigationParams>, NavigationParams>> | undefined = {
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: '#2E51A2'
        },
        headerTitleStyle: {
            fontFamily: "AGRevueCyr"
        },
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        title: "iMAL"
        
    },
    headerMode: "screen"
}

const MainStack = createStackNavigator(screens, defaultOptions);
export default MainStack;