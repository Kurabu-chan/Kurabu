import { MediaNode } from "./ApiBasicTypes";

interface MediaNodeSource {
    MakeRequest(
        limit?: number,
        offset?: number
    ): Promise<{ data: MediaNode[] }>;
}

export default MediaNodeSource;
