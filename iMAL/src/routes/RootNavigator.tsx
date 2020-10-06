import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import Drawer from './MainDrawer';
import Auth from './AuthStack';

const navigator = createSwitchNavigator(
    {
        Auth: Auth,
        App: Drawer
    },
    {
        initialRouteName: 'Auth'
    }
);

export default createAppContainer(navigator);