let CLIENT_ID = process.env.CLIENT_ID || "noenv";
let CLIENT_SECRET = process.env.CLIENT_SECRET || "noenv";

const ERROR_STATUS = "error";
const SUCCESS_STATUS = "success";

function reload() {
    CLIENT_ID = process.env.CLIENT_ID || "noenv";
    CLIENT_SECRET = process.env.CLIENT_SECRET || "noenv";
}

export { CLIENT_ID, CLIENT_SECRET, ERROR_STATUS, SUCCESS_STATUS, reload };