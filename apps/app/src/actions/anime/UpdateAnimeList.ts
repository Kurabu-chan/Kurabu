import { ListBase } from "../../apiBase/ListBase";
import { AnimeDetailsMyListStatus, UpdateAnimeListItemRequest } from "@kurabu/api-sdk";
import { requestErrorHandler } from "#decorators/requestErrorHandler";
import { getListManager } from "#helpers/ListManager";
import { pick } from "lodash";

export class UpdateAnimeList extends ListBase {
    @requestErrorHandler
    async MakeRequest(animeId: number,
        before: AnimeDetailsMyListStatus,
        after: AnimeDetailsMyListStatus): Promise<void> {
        const api = super.getApi();

        const changeList = calculateAlteredFields(before, after);
        const changes = pick(after, changeList);

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
        await getListManager().refreshAnime(animeId);
    }
}

function calculateAlteredFields(before: AnimeDetailsMyListStatus, after: AnimeDetailsMyListStatus): (keyof AnimeDetailsMyListStatus)[] {
    const changed: (keyof AnimeDetailsMyListStatus)[] = [];
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
