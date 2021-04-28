import * as React from "react";

export const navigationRef = React.createRef<any>();

export function navigate(name: string, params: any) {
    navigationRef.current?.navigate(name, params);
}
