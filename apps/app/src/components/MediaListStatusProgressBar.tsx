import { Colors } from "#config/Colors";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { UpdateAnimeList } from "#actions/anime/UpdateAnimeList";
import { AnimeDetailsMyListStatus, MangaDetailsMyListStatus } from "@kurabu/api-sdk";
import { UpdateMangaList } from "#actions/manga/UpdateMangaList";

type Props = {
    height: number;
    color: string;
    min: number;
    max: number;
    current: number;
    mediaId: number | undefined;
    fieldToControl: "numChaptersRead" | "numVolumesRead" | "numEpisodesWatched";
    fullList: AnimeDetailsMyListStatus | MangaDetailsMyListStatus;
}

type State = {
    current: number;
}

export class Progress extends React.PureComponent<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            current: props.current,
        }
    }

    pushRemove() {
        if (this.props.mediaId === undefined) return;

        if (this.props.fieldToControl === "numEpisodesWatched") {
            // Anime
            const action = new UpdateAnimeList();
            this.setState({ ...this.state, current: clamp(this.state.current - 1, this.props.min, this.props.max) },
                () => {
                    if (this.props.mediaId === undefined) return;

                    void action.MakeRequest(this.props.mediaId,
                        {
                            numEpisodesWatched: clamp(this.state.current + 1, this.props.min, this.props.max),
                        },
                        {
                            numEpisodesWatched: this.state.current,
                        });
                });
        } else {
            const action = new UpdateMangaList();
            this.setState({ ...this.state, current: clamp(this.state.current - 1, this.props.min, this.props.max) },
                () => {
                    if (this.props.mediaId === undefined) return;

                    const fieldToControl = this.props.fieldToControl as "numChaptersRead" | "numVolumesRead";

                    const before: Partial<MangaDetailsMyListStatus> = {}
                    before[fieldToControl] = clamp(this.state.current + 1, this.props.min, this.props.max);
                    const after: Partial<MangaDetailsMyListStatus> = {}
                    after[fieldToControl] = this.state.current;

                    void action.MakeRequest(this.props.mediaId, before, after);
                });
        }
    }

    pushAdd() {
        if (this.props.mediaId === undefined) return;

        if (this.props.fieldToControl === "numEpisodesWatched") {
            // Anime
            const action = new UpdateAnimeList();
            this.setState({ ...this.state, current: clamp(this.state.current + 1, this.props.min, this.props.max) },
                () => {
                    if (this.props.mediaId === undefined) return;

                    void action.MakeRequest(this.props.mediaId,
                        {
                            numEpisodesWatched: clamp(this.state.current - 1, this.props.min, this.props.max),
                        },
                        {
                            numEpisodesWatched: this.state.current,
                        });
                });
        } else {
            const action = new UpdateMangaList();

            this.setState({ ...this.state, current: clamp(this.state.current + 1, this.props.min, this.props.max) },
                () => {
                    if (this.props.mediaId === undefined) return;

                    const fieldToControl = this.props.fieldToControl as "numChaptersRead" | "numVolumesRead";

                    const before: Partial<MangaDetailsMyListStatus> = {}
                    before[fieldToControl] = clamp(this.state.current - 1, this.props.min, this.props.max);
                    const after: Partial<MangaDetailsMyListStatus> = {}
                    after[fieldToControl] = this.state.current;

                    void action.MakeRequest(this.props.mediaId, before, after);
                });
        }
    }

    render() {
        let location = (this.state.current - this.props.min) / (this.props.max - this.props.min);

        if (isNaN(location)) location = 0;
        if(!isFinite(location)) location = 0.5;

        console.log(location);

        return (
            <LinearGradient
                colors={[this.props.color, Colors.NO_BACKGROUND]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                locations={[location, location]}
                style={{
                    ...styles.progressContainer,
                    height: this.props.height,
                    borderColor: this.props.color,
                }}>
                <TouchableOpacity
                    onPress={this.pushRemove.bind(this)}
                >
                    <Icon
                        name="remove"
                        style={styles.removeIconStyle}
                        color={Colors.TEXT}
                        size={this.props.height}
                        tvParallaxProperties={{}} />
                </TouchableOpacity>
                <Text style={styles.progressDisplay}>{this.state.current}/{this.props.max === 0 ? "?" : this.props.max}</Text>
                <TouchableOpacity
                    onPress={this.pushAdd.bind(this)}
                >
                    <Icon
                        name="add"
                        style={styles.addIconStyle}
                        color={Colors.TEXT}
                        size={this.props.height}
                        tvParallaxProperties={{}} />
                </TouchableOpacity>
            </LinearGradient>
        );
    }


}

const styles = StyleSheet.create({
    progressContainer: {
        borderWidth: 1,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    progressDisplay: {
        color: Colors.TEXT,
        marginTop: 1
    },
    addIconStyle: {
        margin: -2,
        marginRight: 0
    },
    removeIconStyle: {
        margin: -2
    }
});

// create a function that clamps a value between min and max
function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}
