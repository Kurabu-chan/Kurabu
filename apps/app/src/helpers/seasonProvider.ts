export function getCurrentSeason() {
    const date = new Date();
    const month = date.getMonth();
    if (month <= 3) return "winter";
    if (month <= 6) return "spring";
    if (month <= 9) return "summer";
    return "fall";
}
