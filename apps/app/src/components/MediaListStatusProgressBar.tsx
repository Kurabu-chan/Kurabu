import { Colors } from "#config/Colors";
import React from "react";
import { View, StyleSheet, Text } from "react-native";
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
                async () => {
                    if (this.props.mediaId === undefined) return;

                    await action.MakeRequest(this.props.mediaId,
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
                async () => {
                    if (this.props.mediaId === undefined) return;

                    const fieldToControl = this.props.fieldToControl as "numChaptersRead" | "numVolumesRead";

                    const before: Partial<MangaDetailsMyListStatus> = {}
                    before[fieldToControl] = clamp(this.state.current + 1, this.props.min, this.props.max);
                    const after: Partial<MangaDetailsMyListStatus> = {}
                    after[fieldToControl] = this.state.current;

                    await action.MakeRequest(this.props.mediaId, before, after);
                });
        }
    }

    async pushAdd() {
        if (this.props.mediaId === undefined) return;

        if (this.props.fieldToControl === "numEpisodesWatched") {
            // Anime
            const action = new UpdateAnimeList();
            this.setState({ ...this.state, current: clamp(this.state.current + 1, this.props.min, this.props.max) },
                async () => {
                    if (this.props.mediaId === undefined) return;

                    await action.MakeRequest(this.props.mediaId,
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
                async () => {
                    if (this.props.mediaId === undefined) return;

                    const fieldToControl = this.props.fieldToControl as "numChaptersRead" | "numVolumesRead";

                    const before: Partial<MangaDetailsMyListStatus> = {}
                    before[fieldToControl] = clamp(this.state.current - 1, this.props.min, this.props.max);
                    const after: Partial<MangaDetailsMyListStatus> = {}
                    after[fieldToControl] = this.state.current;

                    await action.MakeRequest(this.props.mediaId, before, after);
                });
        }
    }

    render() {
        let location = (this.state.current - this.props.min) / (this.props.max - this.props.min);

        if (isNaN(location)) location = 0;

        return (
            // <View style={{
            //     ...styles.progressContainer,
            //     height: this.props.height,
            //     backgroundColor: Colors.NO_BACKGROUND,
            //     borderColor: this.props.color,
            // }}>
            //     <View style={{
            //         ...styles.progress,
            //         backgroundColor: this.props.color,
            //         width:  * 100 + "%",
            //         height: "100%",
            //     }}>

            //     </View>


            // </View>
            <LinearGradient
                colors={[this.props.color, Colors.NO_BACKGROUND]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                locations={[location, location]}
                style={{
                    ...styles.progressContainer,
                    height: this.props.height,
                    borderColor: this.props.color,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%"
                }}>
                <TouchableOpacity
                    onPress={this.pushRemove.bind(this)}
                >
                    <Icon
                        name="remove"
                        style={{
                            margin: -2
                        }}
                        color={Colors.TEXT}
                        size={this.props.height}
                        tvParallaxProperties={{}} />
                </TouchableOpacity>
                <Text style={styles.progressDisplay}>{this.state.current}/{this.props.max}</Text>
                <TouchableOpacity
                    onPress={this.pushAdd.bind(this)}
                >
                    <Icon
                        name="add"
                        style={{
                            margin: -2,
                            marginRight: 0
                        }}
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
    },
    progressDisplay: {
        color: Colors.TEXT,
        marginTop: 1
    }
});

// create a function that clamps a value between min and max
function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}
