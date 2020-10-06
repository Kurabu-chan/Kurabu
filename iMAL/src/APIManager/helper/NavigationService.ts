import * as React from 'react';
import { NavigationContainerComponent, NavigationActions } from 'react-navigation';

let navigationRef: NavigationContainerComponent;

export function setTopLevelNavigator(navRef: NavigationContainerComponent){
    navigationRef = navRef;
}

export function navigate(name: string, params: any) {
    navigationRef.dispatch(
        NavigationActions.navigate({
            routeName: name,
            params: params
        })
    );
}