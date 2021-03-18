import { createStackNavigator } from 'react-navigation-stack';
import { NavigationRouteConfigMap, NavigationRoute, NavigationParams, CreateNavigatorConfig, NavigationStackRouterConfig } from 'react-navigation';
import Search from './MainScreens/SearchScreen';
import { StackNavigationOptions, StackNavigationProp, StackNavigationConfig } from 'react-navigation-stack/lib/typescript/src/vendor/types';
import AnimeDetails from './MainScreens/AnimeDetails';

const screens : NavigationRouteConfigMap<StackNavigationOptions,StackNavigationProp<NavigationRoute<NavigationParams>>,unknown>  = {
    Search: {
        screen: Search
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

const SearchStack = createStackNavigator(screens, defaultOptions);
export default SearchStack;