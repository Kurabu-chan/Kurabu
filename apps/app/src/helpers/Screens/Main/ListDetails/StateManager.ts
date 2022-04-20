import { ListDetails } from "#routes/MainScreens/Details/ListDetails";
import { MangaStatus, AnimeStatus } from "@kurabu/api-sdk";
import { ItemValue } from "@react-native-picker/picker/typings/Picker";

export class ListDetailsStateManager {
    private get setState() {
        return this._listDetails.setState.bind(this._listDetails);
    }

    private get state() {
        return this._listDetails.state;
    }

    constructor(private _listDetails: ListDetails) {}

    changeStatus(itemValue: ItemValue) {
        if (this.state.listStatus == undefined) return;
        
        
        const allowedStatuses: string[] = [
            MangaStatus.Reading,
            MangaStatus.Completed,
            MangaStatus.OnHold,
            MangaStatus.Dropped,
            MangaStatus.PlanToRead,
            AnimeStatus.Watching,
            AnimeStatus.Completed,
            AnimeStatus.OnHold,
            AnimeStatus.Dropped,
            AnimeStatus.PlanToWatch,
        ];
        
        if (!allowedStatuses.includes(itemValue.toString())) return;

        console.log("cool")

        this.setState((oldState) => ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus,
                status: itemValue as MangaStatus | AnimeStatus,
            },
        }));
    }

    changeScore(text: string) {
        const reg = /^([0-9]|10)$/;
        if (text.match(reg) == undefined && text !== "") return;
        let intText: number | undefined = undefined;
        if (text !== "") intText = parseInt(text) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
        this.setState((oldState) => ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus,
                score: intText,
            },
        }));
    }

    changeEpisodesWatched(text: string) {
        const reg = /^[0-9]*$/;
        if (text.match(reg) == undefined) return;
        let intText: number | undefined = undefined;
        if (text !== "") intText = parseInt(text) ;
        this.setState((oldState) => ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus,
                numEpisodesWatched: intText,
            },
        }));
    }

    changeChaptersRead(text: string) {
        const reg = /^[0-9]*$/;
        if (text.match(reg) == undefined) return;
        let intText: number | undefined = undefined;
        if (text !== "") intText = parseInt(text) ;
        this.setState((oldState) => ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus,
                numChaptersRead: intText,
            },
        }));
    }

    changeVolumesRead(text: string) {
        const reg = /^[0-9]*$/;
        if (text.match(reg) == undefined) return;
        let intText: number | undefined = undefined;
        if (text !== "") intText = parseInt(text) ;
        this.setState((oldState) => ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus,
                numVolumesRead: intText,
            },
        }));
    }

    changeNumTimesRewatched(text: string) {
        const reg = /^[0-9]*$/;
        if (text.match(reg) == undefined) return;
        let intText: number | undefined = undefined;
        if (text !== "") intText = parseInt(text) ;
        this.setState((oldState) => ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus,
                numTimesRewatched: intText,
            },
        }));
    }

    changeNumTimesReread(text: string) {
        const reg = /^[0-9]*$/;
        if (text.match(reg) == undefined) return;
        let intText: number | undefined = undefined;
        if (text !== "") intText = parseInt(text) ;
        this.setState((oldState) => ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus,
                numTimesReread: intText,
            },
        }));
    }

    changePriority(text: string) {
        const reg = /^[0-2]{0,1}$/;
        if (text.match(reg) == undefined && text !== "") return;
        let intText: number | undefined = undefined;
        if (text !== "") intText = parseInt(text) as 0 | 1 | 2;
        this.setState((oldState) => ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus,
                priority: intText,
            },
        }));
    }

    changeRewatchValue(text: string) {
        const reg = /^[0-5]{0,1}$/;
        if (text.match(reg) == undefined && text !== "") return;
        let intText: number | undefined = undefined;
        if (text !== "") intText = parseInt(text) as 0 | 1 | 2 | 3 | 4 | 5;
        this.setState((oldState) => ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus,
                rewatchValue: intText,
            },
        }));
    }

    changeRereadValue(text: string) {
        const reg = /^[0-5]{0,1}$/;
        if (text.match(reg) == undefined && text !== "") return;
        let intText: number | undefined = undefined;
        if (text !== "") intText = parseInt(text) as 0 | 1 | 2 | 3 | 4 | 5;
        this.setState((oldState) => ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus,
                rereadValue: intText,
            },
        }));
    }

    changeIsRewatching(itemValue: ItemValue) {
        if (this.state.listStatus == undefined) return;
        this.setState((oldState) => ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus,
                isRewatching: itemValue == "true",
            },
        }));
    }

    changeIsRereading(itemValue: ItemValue) {
        if (this.state.listStatus == undefined) return;
        this.setState((oldState) => ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus,
                isRereading: itemValue == "true",
            },
        }));
    }

    changeComments(text: string) {
        this.setState((oldState) => ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus,
                comments: text,
            },
        }));
    }

    changeTags(text: string) {
        this.setState((oldState) => ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus,
                tags: text.split(" "),
            },
        }));
    }
}
