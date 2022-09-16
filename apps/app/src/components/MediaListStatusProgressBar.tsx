import { Colors } from "#config/Colors";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { UpdateAnimeList } from "#actions/anime/UpdateAnimeList";
import { AnimeDetailsMyListStatus, MangaDetailsMyListStatus } from "@kurabu/api-sdk";
import { UpdateMangaList } from "#actions/manga/UpdateMangaList";
import { AppliedStyles, MainColorSets, ProvidedTheme, resolve, ThemedComponent, colors } from "@kurabu/theme";

type Props = {
    height: number;
    color: MainColorSets;
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

export class Progress extends ThemedComponent<Styles, Props, State>{
    constructor(props: Props) {
        super(styles, props);
        this.state = {
            current: props.current,
        }
    }

    pushRemove() {
        if (this.props.mediaId === undefined) return;

        const min = this.props.min;
        const max = this.props.max === 0 ? Infinity : this.props.max;

        if (this.props.fieldToControl === "numEpisodesWatched") {
            // Anime
            const action = new UpdateAnimeList();
            this.setState({ ...this.state, current: clamp(this.state.current - 1, min, max) },
                () => {
                    if (this.props.mediaId === undefined) return;

                    void action.MakeRequest(this.props.mediaId,
                        {
                            numEpisodesWatched: clamp(this.state.current + 1, min, max),
                        },
                        {
                            numEpisodesWatched: this.state.current,
                        });
                });
        } else {
            const action = new UpdateMangaList();
            this.setState({ ...this.state, current: clamp(this.state.current - 1, min, max) },
                () => {
                    if (this.props.mediaId === undefined) return;

                    const fieldToControl = this.props.fieldToControl as "numChaptersRead" | "numVolumesRead";

                    const before: Partial<MangaDetailsMyListStatus> = {}
                    before[fieldToControl] = clamp(this.state.current + 1, min, max);
                    const after: Partial<MangaDetailsMyListStatus> = {}
                    after[fieldToControl] = this.state.current;

                    void action.MakeRequest(this.props.mediaId, before, after);
                });
        }
    }

    pushAdd() {
        if (this.props.mediaId === undefined) return;

        const min = this.props.min;
        const max = this.props.max === 0 ? Infinity : this.props.max;

        if (this.props.fieldToControl === "numEpisodesWatched") {
            // Anime
            const action = new UpdateAnimeList();
            this.setState({ ...this.state, current: clamp(this.state.current + 1, min, max) },
                () => {
                    if (this.props.mediaId === undefined) return;

                    void action.MakeRequest(this.props.mediaId,
                        {
                            numEpisodesWatched: clamp(this.state.current - 1, min, max),
                        },
                        {
                            numEpisodesWatched: this.state.current,
                        });
                });
        } else {
            const action = new UpdateMangaList();

            this.setState({ ...this.state, current: clamp(this.state.current + 1, min, max) },
                () => {
                    if (this.props.mediaId === undefined) return;

                    const fieldToControl = this.props.fieldToControl as "numChaptersRead" | "numVolumesRead";

                    const before: Partial<MangaDetailsMyListStatus> = {}
                    before[fieldToControl] = clamp(this.state.current - 1, min, max);
                    const after: Partial<MangaDetailsMyListStatus> = {}
                    after[fieldToControl] = this.state.current;

                    void action.MakeRequest(this.props.mediaId, before, after);
                });
        }
    }

	renderThemed(styles: AppliedStyles<Styles>, providedTheme: ProvidedTheme) {
        let location = (this.state.current - this.props.min) / (this.props.max - this.props.min);

        if (isNaN(location)) location = 0;
        if (!isFinite(location)) location = 0.5;

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const color: string = resolve(colors.color(this.props.color), providedTheme);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const textColor: string = resolve(colors.onColor(this.props.color, "paragraph"), providedTheme);

        return (
            <LinearGradient
                colors={[color, Colors.NO_BACKGROUND]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                locations={[location, location]}
                style={[
                    ...styles.progressContainer,
					{
						height: this.props.height,
						borderColor: color
					}
                ]}>
                <TouchableOpacity
                    onPress={this.pushRemove.bind(this)}
                >
                    <Icon
                        name="remove"
                        style={StyleSheet.flatten(styles.removeIconStyle)}
                        color={StyleSheet.flatten(styles.iconColor).color}
                        size={this.props.height}
                        tvParallaxProperties={{}} />
                </TouchableOpacity>
				<Text style={StyleSheet.flatten([...styles.progressDisplay, { color: textColor }])}>{this.state.current}/{this.props.max === 0 ? "?" : this.props.max}</Text>
                <TouchableOpacity
                    onPress={this.pushAdd.bind(this)}
				>
                    <Icon
                        name="add"
						style={StyleSheet.flatten(styles.addIconStyle)}
                        color={StyleSheet.flatten(styles.iconColor).color}
                        size={this.props.height}
                        tvParallaxProperties={{}} />
                </TouchableOpacity>
            </LinearGradient>
        );
    }
} 

type Styles = typeof styles;
const styles = StyleSheet.create({
    progressContainer: {
        borderWidth: 1,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    progressDisplay: {
        marginTop: 1
    },
    addIconStyle: {
        margin: -2,
        marginRight: 0
    },
    removeIconStyle: {
        margin: -2
	},
	iconColor: {
		color: colors.onColor("primary", "paragraph")
	}
});

// create a function that clamps a value between min and max
function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}
