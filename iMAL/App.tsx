import App from './src/routes/RootNavigator';
import * as Font from 'expo-font';
import React from 'react';
import { AppLoading } from 'expo';
import * as Linking from 'expo-linking';
import { AppState, AppStateStatus } from 'react-native';
import Authentication from './src/APIManager/Authenticate';
import { NavigationDrawerScreenProps } from 'react-navigation-drawer';
import { setTopLevelNavigator, navigate } from './src/APIManager/helper/NavigationService';

const getFonts = () => Font.loadAsync({
    'AGRevueCyr': require('./assets/fonts/AGRevueCyr.ttf')
});

const prefix = Linking.makeUrl("/");

type StateType = {
    fonts: boolean,
    appstate: AppStateStatus,
    drawerProps: NavigationDrawerScreenProps
}

export default class Application extends React.Component<NavigationDrawerScreenProps, StateType>{
    constructor(props: NavigationDrawerScreenProps) {        
        super(props);
        this.state = {
            fonts: false,
            appstate: AppState.currentState,
            drawerProps: props
        };
    }

    componentDidMount() {
        this._checkInitialUrl();

        AppState.addEventListener('change', this._handleAppStateChange);
        Linking.addEventListener('url', (ss) => {
            this._handleUrl(ss.url);
        })
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    private _handleAppStateChange = async (nextAppState: AppStateStatus) => {
        if (this.state.appstate.match(/inactive|background/) && nextAppState === 'active') {
            this._checkInitialUrl();
        }
        this.setState({ ...this.state, appstate: nextAppState });
    }

    private _checkInitialUrl = async () => {
        const url = await Linking.getInitialURL();
        if(url?.includes("auth")){
            this._handleUrl(url);
        }        
    }

    private _handleUrl = (url: string | null) => {
        console.log(`received url ${url}`);
        if (url != null) {
            if(url.includes("auth")){
                let uuid = url.split("auth/")[1];
                console.log(uuid)
                Authentication.getInstance().then((auth) => {
                    console.log("save");
                    auth.setCode(uuid);
                    console.log("Change page");
                    try{
                        navigate("Main",undefined);
                    }catch(e){
                        console.log(e);
                    }
                    
                    console.log("changed?");
                }).catch((e) => {
                    
                });
            }
        }
    }

    render() {
        const setFontsLoaded = (yes: boolean) => {
            this.setState({ ...this.state, fonts: yes });
        }
        if (this.state.fonts) {
            return (
                <App 
                uriPrefix={prefix} 
                enableURLHandling={false}
                ref={navigationRef => {
                    if(navigationRef != null){
                        setTopLevelNavigator(navigationRef);
                    }                   
                }}/>
            );
        } else {
            return (
                <AppLoading
                    startAsync={getFonts}
                    onFinish={() => { setFontsLoaded(true); }}
                />
            );
        }
    }
}