import * as React from "react";
import { Queue } from "#helpers/Queue";
import { NavigationContainerRef } from "@react-navigation/core";
import { AuthStackParamList } from "./AuthStack";

export const navigationRef = React.createRef<NavigationContainerRef<AuthStackParamList>>();
let ready = false;
const navQueue = new Queue<{
    name: keyof AuthStackParamList;
    params: AuthStackParamList[keyof AuthStackParamList];
}>();

export function navigationRefReady() {
    ready = true;
    if (navQueue.length > 0) {
        while (navQueue.length > 0) {
            const pop = navQueue.surePop();
            navigate(pop.name, pop.params);
        }
    }
}

export function navigate(name: keyof AuthStackParamList, params?: AuthStackParamList[keyof AuthStackParamList]) {
    if (ready) {
        navigationRef.current?.navigate(name, params);
    } else {
        navQueue.push({ name, params });
    }
}
