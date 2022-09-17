import { niceTextFormat } from "#helpers/textFormatting";
import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Divider } from "#comps/themed/Divider";
import TimeAgo from "react-native-timeago";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { HomeStackParamList } from "#routes/MainStacks/HomeStack";
import { AddAnimeToList } from "#actions/anime/AddAnimeToList";
import { AddMangaToList } from "#actions/manga/AddMangaToList";
import { AnimeDetailsMediaTypeEnum, AnimeDetailsMyListStatus, MangaDetailsMediaTypeEnum, MangaDetailsMyListStatus } from "@kurabu/api-sdk";
import { AppliedStyles, colors, sizing, ThemedComponent } from "@kurabu/theme";
import { Typography } from "./themed/Typography";

type Props = {
	navigation: StackNavigationProp<HomeStackParamList, "DetailsScreen">;
	route: RouteProp<HomeStackParamList, "DetailsScreen">;
	props?: AnimeDetailsMyListStatus | MangaDetailsMyListStatus;
	mediaType: AnimeDetailsMediaTypeEnum | MangaDetailsMediaTypeEnum;
	id: number;
	parentRefresh: () => void;
};

type State = {
	isAnime: boolean;
};

export class ListStatus extends ThemedComponent<Styles, Props, State> {
	constructor(props: Props) {
		super(styles, props);

		const mangaMediatTypes = [
			"manga",
			"light_novel",
			"manhwa",
			"one_shot",
			"manhua",
			"doujinshi",
			"novel",
		];

		this.state = {
			isAnime: !mangaMediatTypes.includes(props.mediaType.toString()),
		};
	}

	showListStatus() {
		this.props.navigation.push("ListDetailsScreen", {
			id: this.props.id,
			mediaType: this.props.mediaType,
		});
	}

	async addToList() {
		let success = false;
		let action: AddAnimeToList | AddMangaToList;
		if (this.state.isAnime == true) {
			action = new AddAnimeToList();
		} else {
			action = new AddMangaToList();
		}

		await action.MakeRequest(this.props.id)
		success = true;

		if (success) this.props.parentRefresh();
	}

	renderAnime(props: AnimeDetailsMyListStatus, styles: AppliedStyles<Styles>) {
		return (
			<View style={styles.TopAreaData}>
				<View style={styles.TopAreaLabels}>
					<Typography colorVariant="primary" isOnContainer={false} textKind={"paragraph"} variant={"body1"} style={styles.TopAreaLabel}>Status:</Typography>
					<Typography colorVariant="primary" isOnContainer={false} textKind={"paragraph"} variant={"body1"} style={styles.TopAreaLabel}>Watched episodes:</Typography>
					<Typography colorVariant="primary" isOnContainer={false} textKind={"paragraph"} variant={"body1"} style={styles.TopAreaLabel}>Status updated:</Typography>
				</View>
				<View style={styles.TopAreaValues}>
					<Typography colorVariant="primary" isOnContainer={false} textKind={"paragraph"} variant={"body1"}>{niceTextFormat(props.status?.toString())}</Typography>
					<Typography colorVariant="primary" isOnContainer={false} textKind={"paragraph"} variant={"body1"}>{props.numEpisodesWatched}</Typography>

					<Typography colorVariant="primary" isOnContainer={false} textKind={"paragraph"} variant={"body1"}>
						<TimeAgo time={props.updatedAt ?? ""} interval={5000} />
					</Typography>
				</View>
			</View>
		);
	}

	renderManga(props: MangaDetailsMyListStatus, styles: AppliedStyles<Styles>) {
		return (
			<View style={styles.TopAreaData}>
				<View style={styles.TopAreaLabels}>
					<Typography colorVariant="primary" isOnContainer={false} textKind={"paragraph"} variant={"body1"} style={styles.TopAreaLabel}>Status:</Typography>
					<Typography colorVariant="primary" isOnContainer={false} textKind={"paragraph"} variant={"body1"} style={styles.TopAreaLabel}>Volumes read:</Typography>
					<Typography colorVariant="primary" isOnContainer={false} textKind={"paragraph"} variant={"body1"} style={styles.TopAreaLabel}>Chapters read:</Typography>
					<Typography colorVariant="primary" isOnContainer={false} textKind={"paragraph"} variant={"body1"} style={styles.TopAreaLabel}>Status updated:</Typography>
				</View>
				<View style={styles.TopAreaValues}>
					<Typography colorVariant="primary" isOnContainer={false} textKind={"paragraph"} variant={"body1"}>{niceTextFormat(props.status?.toString())}</Typography>
					<Typography colorVariant="primary" isOnContainer={false} textKind={"paragraph"} variant={"body1"}>{props.numVolumesRead}</Typography>
					<Typography colorVariant="primary" isOnContainer={false} textKind={"paragraph"} variant={"body1"}>{props.numChaptersRead}</Typography>

					<Typography colorVariant="primary" isOnContainer={false} textKind={"paragraph"} variant={"body1"}>
						<TimeAgo time={props.updatedAt ?? ""} interval={5000} />
					</Typography>
				</View>
			</View>
		);
	}

	showListStatusButton(styles: AppliedStyles<Styles>) {
		if (this.props.props == undefined) {
			return (
				<TouchableOpacity
					style={styles.listStatusEdit}
					onPress={() => {
						void this.addToList();
					}}
				>
					<Typography colorVariant="primary" isOnContainer={false} textKind={"paragraph"} variant={"body1"}
						style={styles.alignSelfCenter}
					>
						Add to list
					</Typography>
				</TouchableOpacity>
			);
		} else {
			return (
				<TouchableOpacity
					style={styles.listStatusEdit}
					onPress={() => {
						this.showListStatus();
					}}
				>
					<Typography colorVariant="primary" isOnContainer={false} textKind={"paragraph"} variant={"body1"}
						style={styles.alignSelfCenter}
					>
						Details
					</Typography>
				</TouchableOpacity>
			);
		}
	}

	renderThemed(styles: AppliedStyles<Styles>) {
		if (this.props.props === undefined) {
			return (
				<View>
					<View style={styles.TopAreaData}>
						<View style={styles.TopAreaLabels}>
							<Typography colorVariant="primary" isOnContainer={false} textKind={"paragraph"} variant={"body1"} style={styles.TopAreaLabel}>Status:</Typography>
						</View>
						<View style={styles.TopAreaValues}>
							<Typography colorVariant="primary" isOnContainer={false} textKind={"paragraph"} variant={"body1"}>
								{this.state.isAnime
									? niceTextFormat("not-watching")
									: niceTextFormat("not-reading")}
							</Typography>
						</View>
					</View>
					<Divider margin={false} variant="secondary" isOnContainer={false} widthPercentage={0} />
					{this.showListStatusButton(styles)}
				</View>
			);
		}

		return (
			<View>
				{this.state.isAnime
					? this.renderAnime(this.props.props as AnimeDetailsMyListStatus, styles)
					: this.renderManga(this.props.props as MangaDetailsMyListStatus, styles)}
				<Divider margin={false} variant="secondary" isOnContainer={false} widthPercentage={0} />
				{this.showListStatusButton(styles)}
			</View>
		);
	}

}

type Styles = typeof styles;
const styles = StyleSheet.create({
	alignSelfCenter: {
		alignSelf: "center",
	},
	TopAreaLabels: {
		flexDirection: "column",
		flex: 1.3,
	},
	TopAreaValues: {
		flexDirection: "column",
		flex: 2,
	},
	TopAreaData: {
		flexDirection: "row",
	},
	TopAreaLabel: {
		fontWeight: "bold",
	},
	listStatusEdit: {
		width: sizing.vw(100, -20),
		paddingTop: sizing.spacing("medium"),
		paddingBottom: sizing.spacing("medium"),
		backgroundColor: colors.color("primary"),
	},
});
