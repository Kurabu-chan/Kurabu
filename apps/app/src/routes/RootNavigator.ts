import * as React from "react";
import { Queue } from "#helpers/Queue";

export const navigationRef = React.createRef<any>();
let ready = false;
const navQueue = new Queue<{
    name: string;
    params: any;
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

export function navigate(name: string, params?: any) {
    if (ready) {
        navigationRef.current?.navigate(name, params);
    } else {
        navQueue.push({ name, params });
    }
}

type swListener = (sw: "Auth" | "Drawer") => void;
const listeners: swListener[] = [];

export function registerSwitchListener(listener: swListener) {
    listeners.push(listener);
}

export function DoSwitch(switchTo: "Auth" | "Drawer") {
    listeners.forEach((x) => x(switchTo));
}
