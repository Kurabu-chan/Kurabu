type voidFunction = () => void;
type ButtonState = {
    currentPage: keyof BackButtonFunctionsType,
    backButtons: BackButtonFunctionsType,
    rerenderers: voidFunction[]
}
type BackButtonFunctionsType = {
    Main?: voidFunction;
    Ranking?: voidFunction;
    Search?: voidFunction;
    Seasonal?: voidFunction;
    Suggestions?: voidFunction;
};

let backButtonState: ButtonState = {
    currentPage: "Main",
    backButtons: {
        Main: undefined,
        Ranking: undefined,
        Search: undefined,
        Seasonal: undefined,
        Suggestions: undefined,
    },
    rerenderers: []
}

export function changeActivePage(page: keyof BackButtonFunctionsType): void {
    console.log(`Changing active page to ${page}`)
    backButtonState.currentPage = page;
    rerender();
}

export function getActivePage(): keyof BackButtonFunctionsType {
    return backButtonState.currentPage;
}

export function registerRerenderer(func: voidFunction): void {
    backButtonState.rerenderers.push(func);
}

export function changeBackButton(page: keyof BackButtonFunctionsType, func: voidFunction | undefined) {
    backButtonState.backButtons[page] = func;
    changeActivePage(page);
}

export function getCurrentBackButtonFunc(): voidFunction | undefined {
    return backButtonState.backButtons[backButtonState.currentPage];
}

function rerender(): void {
    backButtonState.rerenderers.forEach((x: voidFunction): void => x());
}