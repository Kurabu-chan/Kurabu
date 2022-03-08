import { AnimeDetails, MangaDetails } from "@kurabu/api-sdk";

type params = {
    id: number;
    mediaType: AnimeDetails.MediaTypeEnum | MangaDetails.MediaTypeEnum;
};

export default params;
