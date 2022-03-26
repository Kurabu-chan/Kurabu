/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import MALError from "./MALError";

export default class MALMediaNotFound extends MALError {
    constructor(message?: string) {
        super(message);
        this.errorCode = "042";
        this.httpCode = 404;
        this.name = "MALMediaNotFound";
    }
}
