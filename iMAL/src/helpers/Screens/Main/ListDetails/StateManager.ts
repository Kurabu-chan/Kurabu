import { ListDetails, Props, State } from "#routes/MainScreens/ListDetails";
import { ItemValue } from "@react-native-community/picker/typings/Picker";

type setState<P, S> = <K extends keyof S>(
    state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
    callback?: () => void
) => void;


type ListDetailsStateManagerProps = {
    setState: setState<Props, State>
}
export class ListDetailsStateManager {
    private get setState() {
        return this._listDetails.setState.bind(this._listDetails);
    }

    private get state() {
        return this._listDetails.state;
    }


    constructor(private _listDetails: ListDetails) { }

    changeStatus(itemValue: ItemValue, itemIndex: number) {
        if (this.state.listStatus == undefined) return;
        this.setState((oldState) =>
        ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus!,
                status: itemValue as any
            }
        }))
    }

    changeScore(text: string) {
        const reg = /^([0-9]|10)$/;
        if (text.match(reg) == undefined && text !== "") return;
        let intText: number | undefined = undefined;
        if (text !== "")
            intText = parseInt(text) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
        this.setState((oldState) => ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus!,
                score: intText as any
            }
        }))
    }

    changeEpisodesWatched(text: string) {
        const reg = /^[0-9]*$/;
        if (text.match(reg) == undefined) return;
        let intText: number | undefined = undefined;
        if (text !== "")
            intText = parseInt(text) as number;
        this.setState((oldState) => ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus!,
                num_episodes_watched: intText as any
            }
        }))
    }

    changeChaptersRead(text: string) {
        const reg = /^[0-9]*$/;
        if (text.match(reg) == undefined) return;
        let intText: number | undefined = undefined;
        if (text !== "")
            intText = parseInt(text) as number;
        this.setState((oldState) => ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus!,
                num_chapters_read: intText as any
            }
        }))
    }

    changeVolumesRead(text: string) {
        const reg = /^[0-9]*$/;
        if (text.match(reg) == undefined) return;
        let intText: number | undefined = undefined;
        if (text !== "")
            intText = parseInt(text) as number;
        this.setState((oldState) => ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus!,
                num_volumes_read: intText as any
            }
        }))
    }

    changeNumTimesRewatched(text: string) {
        const reg = /^[0-9]*$/;
        if (text.match(reg) == undefined) return;
        let intText: number | undefined = undefined;
        if (text !== "")
            intText = parseInt(text) as number;
        this.setState((oldState) => ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus!,
                num_times_rewatched: intText as any
            }
        }))
    }

    changeNumTimesReread(text: string) {
        const reg = /^[0-9]*$/;
        if (text.match(reg) == undefined) return;
        let intText: number | undefined = undefined;
        if (text !== "")
            intText = parseInt(text) as number;
        this.setState((oldState) => ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus!,
                num_times_reread: intText as any
            }
        }))
    }

    changePriority(text: string) {
        const reg = /^[0-2]{0,1}$/;
        if (text.match(reg) == undefined && text !== "") return;
        let intText: number | undefined = undefined;
        if (text !== "")
            intText = parseInt(text) as 0 | 1 | 2;
        this.setState((oldState) => ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus!,
                priority: intText as any
            }
        }))
    }

    changeRewatchValue(text: string) {
        const reg = /^[0-5]{0,1}$/;
        if (text.match(reg) == undefined && text !== "") return;
        let intText: number | undefined = undefined;
        if (text !== "")
            intText = parseInt(text) as 0 | 1 | 2 | 3 | 4 | 5;
        this.setState((oldState) => ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus!,
                rewatch_value: intText as any
            }
        }))
    }

    changeRereadValue(text: string) {
        const reg = /^[0-5]{0,1}$/;
        if (text.match(reg) == undefined && text !== "") return;
        let intText: number | undefined = undefined;
        if (text !== "")
            intText = parseInt(text) as 0 | 1 | 2 | 3 | 4 | 5;
        this.setState((oldState) => ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus!,
                reread_value: intText as any
            }
        }))
    }

    changeIsRewatching(itemValue: ItemValue, itemIndex: number) {
        if (this.state.listStatus == undefined) return;
        this.setState((oldState) =>
        ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus!,
                is_rewatching: itemValue == "true"
            }
        }))
    }

    changeIsRereading(itemValue: ItemValue, itemIndex: number) {
        if (this.state.listStatus == undefined) return;
        this.setState((oldState) =>
        ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus!,
                is_rereading: itemValue == "true"
            }
        }))
    }

    changeComments(text: string) {
        this.setState((oldState) =>
        ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus!,
                comments: text
            }
        }))
    }

    changeTags(text: string) {
        this.setState((oldState) =>
        ({
            ...oldState,
            listStatus: {
                ...oldState.listStatus!,
                tags: text.split(" ")
            }
        }))
    }
}