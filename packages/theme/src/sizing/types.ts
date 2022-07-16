export type Rounding =
    "none" | "extraSmall" | "small" | "medium" | "large" | "extraLarge" | "full";

export type Spacing =
    "small" | "halfSmall" | "medium" | "halfMedium" | "large" | "halfLarge";

export type Sizing = {
    rounding: Record<Rounding, number>,
    spacing: Record<Spacing, number>
}
