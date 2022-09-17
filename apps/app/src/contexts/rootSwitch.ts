import { createContext } from "react";

export const RootSwitchContext = createContext<(a: "Auth" | "Drawer") => void>(() => { return null; });
