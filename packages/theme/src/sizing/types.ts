/**
 * All rounding options
 *
 * @category Advanced Use
 */
export type Rounding =
    "none" | "extraSmall" | "small" | "medium" | "large" | "extraLarge" | "full";

/**
 * All spacing options
 *
 * @category Advanced Use
 */
export type Spacing =
    "small" | "halfSmall" | "medium" | "halfMedium" | "large" | "halfLarge";

/**
 * All sizing options
 *
 * @category General Use
 */
export type Sizing = {
    rounding: Record<Rounding, number>,
    spacing: Record<Spacing, number>
}
