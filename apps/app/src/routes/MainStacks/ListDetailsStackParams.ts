import { AnimeDetailsMediaTypeEnum, MangaDetailsMediaTypeEnum } from "@kurabu/api-sdk";

type params = {
    id: number;
    mediaType: AnimeDetailsMediaTypeEnum | MangaDetailsMediaTypeEnum;
};

export default params;
