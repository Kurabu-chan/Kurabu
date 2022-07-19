import { TokenReference } from "../Tokens";
import { Rounding, Spacing } from "./types";

/**
 * All functions used for creating sizing tokens.
 * These can be used inside your styles
 *
 * @category General Use
 */
export const sizing = {
    vh<T extends string | number>(_vh: number, plus?: number): T {
        if (plus === undefined || plus === 0) {
            return new TokenReference(`themed.ref.siz.vh.${_vh}`) as unknown as T;
        }

        if (plus > 0) {
            return vhPlus(_vh, plus);
        }

        return vhMinus(_vh, -plus);
    },
    vw<T extends string | number>(_vw: number, plus?: number): T {
        if (plus === undefined || plus === 0) {
            return new TokenReference(`themed.ref.siz.vw.${_vw}`) as unknown as T;
        }

        if (plus > 0) {
            return vwPlus(_vw, plus);
        }

        return vwMinus(_vw, -plus);
    },
    // eslint-disable-next-line sort-keys
    rounding<T extends string | number>(round: Rounding): T {
        return new TokenReference(`themed.ref.siz.rounding.${round}`) as unknown as T;
    },
    spacing<T extends string | number>(space: Spacing) : T {
        return new TokenReference(`themed.ref.siz.spacing.${space}`) as unknown as T;
    }
};

function vwPlus<T extends string | number>(_vw: number, plus: number): T {
    return new TokenReference(`themed.ref.siz.vw.${_vw}.plus.${plus}`) as unknown as T;
}

function vhPlus<T extends string | number>(_vh: number, plus: number): T {
    return new TokenReference(`themed.ref.siz.vh.${_vh}.plus.${plus}`) as unknown as T;
}

function vwMinus<T extends string | number>(_vw: number, minus: number): T {
    return new TokenReference(`themed.ref.siz.vw.${_vw}.minus.${minus}`) as unknown as T;
}

function vhMinus<T extends string | number>(_vh: number, minus: number): T {
    return new TokenReference(`themed.ref.siz.vh.${_vh}.minus.${minus}`) as unknown as T;
}
