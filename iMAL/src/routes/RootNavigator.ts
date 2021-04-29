import * as React from "react";
import { Queue } from "../helpers/Queue";

export const navigationRef = React.createRef<any>();
var ready = false;
var navQueue = new Queue<{ name: string; params: any }>();

export function navigationRefReady() {
    ready = true;
    if (navQueue.length > 0) {
        while (navQueue.length > 0) {
            var pop = navQueue.surePop();
            navigate(pop.name, pop.params);
        }
    }
}

export function navigate(name: string, params: any) {
    if (ready) {
        navigationRef.current?.navigate(name, params);
    } else {
        navQueue.push({ name, params });
    }
}
