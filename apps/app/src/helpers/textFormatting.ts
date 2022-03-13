export function niceDateFormat(date: Date | undefined): string {
    if (date === undefined) return "N/A";
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

export function niceTextFormat(str: string | undefined, sentenceCase: boolean = false): string {
    if (str === undefined) return "";

    var retStr = "";
    var upper = true;
    const toUpperCaseChars = ["-", "_"];
    for (const char of str) {
        if (toUpperCaseChars.includes(char)) {
            if (sentenceCase) upper = true;
            retStr += " ";
        } else if (upper) {
            retStr += char.toUpperCase();
            upper = false;
        } else retStr += char;
    }
    return retStr;
}