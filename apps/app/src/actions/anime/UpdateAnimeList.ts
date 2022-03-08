import { ListBase } from "../../apiBase/ListBase";
import { AnimeDetailsMyListStatus, UpdateAnimeListItemRequest } from "@kurabu/api-sdk";
import { requestErrorHandler } from "#decorators/requestErrorHandler";

export class UpdateAnimeList extends ListBase {
    @requestErrorHandler
    async MakeRequest(animeId: number,
        before: AnimeDetailsMyListStatus,
        after: AnimeDetailsMyListStatus): Promise<void> {
        var api = await super.getApi();

        const changeList = calculateAlteredFields(before, after);
        const changes = select(changeList, after);

        const requestParams: UpdateAnimeListItemRequest = {
            animeId,
            comments: changes.comments,
            isRewatching: changes.isRewatching,
            numTimesRewatched: changes.numTimesRewatched,
            numWatchedEpisodes: changes.numEpisodesWatched,
            priority: changes.priority,
            rewatchValue: changes.rewatchValue,
            score: changes.score,
            status: changes.status === undefined ? undefined : changes.status,
            tags: changes.tags?.join(", "),
        };

        await api.updateAnimeListItem(requestParams);
    }
}

function select(toSelect: (keyof AnimeDetailsMyListStatus)[], selectFrom: AnimeDetailsMyListStatus): Partial<AnimeDetailsMyListStatus> {
    const out: any = {};
    for (const selectElement of toSelect) {
        out[selectElement] = selectFrom[selectElement];
    }

    return out;
}

function calculateAlteredFields(before: AnimeDetailsMyListStatus, after: AnimeDetailsMyListStatus): (keyof AnimeDetailsMyListStatus)[] {
    var changed: (keyof AnimeDetailsMyListStatus)[] = [];
    for (const key in before) {
        if (before.hasOwnProperty(key)) {
            const beforeValue = before[key as keyof AnimeDetailsMyListStatus];
            const afterValue = after[key as keyof AnimeDetailsMyListStatus];
            if (beforeValue === afterValue) continue;

            changed.push(key as keyof AnimeDetailsMyListStatus);
        }
    }
    return changed;
}