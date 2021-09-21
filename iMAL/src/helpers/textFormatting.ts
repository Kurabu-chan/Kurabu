export function niceDateFormat(date: Date): string {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

export function niceTextFormat(str: string | undefined): string {
    if (str === undefined) return "";

    var retStr = "";
    var upper = true;
    const toUpperCaseChars = ["-", "_"];
    for (const char of str) {
        if (toUpperCaseChars.includes(char)) upper = true;
        else if (upper) {
            retStr += char.toUpperCase();
            upper = false;
        }
        else retStr += char;
    }
    return retStr;
}