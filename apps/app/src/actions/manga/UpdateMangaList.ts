import { ListBase } from "../../apiBase/ListBase";
import { MangaDetailsMyListStatus, UpdateMangaListItemRequest } from "@kurabu/api-sdk";
import { requestErrorHandler } from "#decorators/requestErrorHandler";
import { getListManager } from "#helpers/ListManager";

export class UpdateMangaList extends ListBase {
    @requestErrorHandler
    async MakeRequest(mangaId: number,
        before: MangaDetailsMyListStatus,
        after: MangaDetailsMyListStatus): Promise<void> {
        const api = await super.getApi();

        const changeList = calculateAlteredFields(before, after);
        const changes = select(changeList, after);

        const requestParams: UpdateMangaListItemRequest = {
            mangaId,
            comments: changes.comments,
            isRereading: changes.isRereading,
            numTimesReread: changes.numTimesReread,
            numVolumesRead: changes.numVolumesRead,
            numChaptersRead: changes.numChaptersRead,
            priority: changes.priority,
            rereadValue: changes.rereadValue,
            score: changes.score,
            status: changes.status === undefined ? undefined : changes.status,
            tags: changes.tags?.join(", ")
        }

        await api.updateMangaListItem(requestParams);
        await getListManager().refreshManga(mangaId);
    }
}

function select(toSelect: (keyof MangaDetailsMyListStatus)[], selectFrom: MangaDetailsMyListStatus): Partial<MangaDetailsMyListStatus> {
    const out: any = {};
    for (const selectElement of toSelect) {
        out[selectElement] = selectFrom[selectElement];
    }

    return out;
}

function calculateAlteredFields(before: MangaDetailsMyListStatus, after: MangaDetailsMyListStatus): (keyof MangaDetailsMyListStatus)[] {
    const changed: (keyof MangaDetailsMyListStatus)[] = [];
    for (const key in before) {
        if (before.hasOwnProperty(key)) {
            const beforeValue = before[key as keyof MangaDetailsMyListStatus];
            const afterValue = after[key as keyof MangaDetailsMyListStatus];
            if (beforeValue === afterValue) continue;

            changed.push(key as keyof MangaDetailsMyListStatus);
        }
    }
    return changed;
}