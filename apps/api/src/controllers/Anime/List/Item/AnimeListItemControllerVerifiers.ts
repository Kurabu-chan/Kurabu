export const allowedStati = ["watching", "completed", "on_hold", "dropped", "plan_to_watch"];

export function verifyAnimeId(animeId: number): boolean {
    return animeId > 0;
}

export function verifyStatus(status: string): boolean {
    return allowedStati.includes(status);
}

export function verifyScore(score: number): boolean {
    return score >= 0 && score <= 10;
}

export function verifyPriority(priority: number): boolean {
    return priority >= 0 && priority <= 2;
}

export function verifyRewatchValue(rewatchValue: number): boolean {
    return rewatchValue >= 0 && rewatchValue <= 5;
}
