import { AnimeDetailsSource } from "#data/anime/AnimeDetailsSource";
import { UpdateAnimeList } from "#actions/anime/UpdateAnimeList";
import { MangaDetailsSource } from "#data/manga/MangaDetailsSource";
import { Colors } from "#config/Colors";
import { BackButtonFunctionsType, changeActivePage, changeBackButton, getActivePage } from "#helpers/backButton";
import { ListDetailsStateManager } from "#helpers/Screens/Main/ListDetails/StateManager";
import { niceTextFormat } from "#helpers/textFormatting";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
	SafeAreaView,
	ScrollView,
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	TouchableOpacity,
	TextStyle,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import TimeAgo from "react-native-timeago";
import { AnimeDetailsMediaTypeEnum, AnimeDetailsMyListStatus, AnimeStatus, MangaDetailsMediaTypeEnum, MangaDetailsMyListStatus, MangaStatus } from "@kurabu/api-sdk";
import { DetailsStackParamList } from "#routes/MainStacks/DetailsStack";
import { UpdateMangaList } from "#actions/manga/UpdateMangaList";
import { MainGradientBackground } from "#comps/MainGradientBackground";
import { AppliedStyles, colors, ProvidedTheme, resolve, sizing, ThemedComponent } from "@kurabu/theme";
import { createTypographyStyles, Typography } from "#comps/themed/Typography";
import { TopAreaLabel, topAreaLabelStyles, topAreaLabelTypographySettings } from "./components/TopAreaLabel";
import { TopAreaValue, topAreaValueStyles } from "./components/TopAreaValue";
import { Picker } from "#comps/themed/Picker";
import { Spacer } from "#comps/themed/Spacer";

export type Props = {
	navigation: StackNavigationProp<DetailsStackParamList, "ListDetailsScreen">;
	route: RouteProp<DetailsStackParamList, "ListDetailsScreen">;
};

export type State = {
	mediaId: number;
	listStatus?: Partial<AnimeDetailsMyListStatus | MangaDetailsMyListStatus>;
	listenerToUnMount?: () => void;
	page: keyof BackButtonFunctionsType;
	mediaType: AnimeDetailsMediaTypeEnum | MangaDetailsMediaTypeEnum;
	isAnime: boolean;
	isEditing: boolean;
	before?: Partial<AnimeDetailsMyListStatus | MangaDetailsMyListStatus>;
	pickers: {
		status: boolean,
		rewatchingOrRereading: boolean
	}
};

export class ListDetails extends ThemedComponent<Styles, Props, State> {
	private stateManager: ListDetailsStateManager;
	constructor(props: Props) {
		super(styles, props);
		this.stateManager = new ListDetailsStateManager(this);

		let mediaId = props.route.params.id;
		const mediaType = props.route.params.mediaType;
		if (mediaId == undefined) {
			mediaId = 1;
		}

		console.log(`${mediaType} ${mediaId}`);

		const mangaMediatTypes = [
			"manga",
			"light_novel",
			"manhwa",
			"one_shot",
			"manhua",
			"doujinshi",
			"novel",
		];
		const isAnime = !mangaMediatTypes.includes(mediaType.toString());
		this.state = {
			mediaId: mediaId,
			listenerToUnMount: undefined,
			page: getActivePage(),
			mediaType: mediaType,
			isAnime: isAnime,
			isEditing: false,
			pickers: {
				rewatchingOrRereading: false,
				status: false,
			}
		};

		void this.refresh();
	}

	async refresh() {
		const animeFields = "id, title, main_picture, alternative_titles, my_list_status{status, comments, is_rewatching, num_times_rewatched, num_watched_episodes, priority, rewatch_value, score, tags}";
		const mangaFields = "id, title, main_picture, alternative_titles, my_list_status{status, score, num_volumes_read, num_chapters_read, is_rereading, updated_at, priority, num_times_reread, reread_value, tags, comments}";

		let listSource: AnimeDetailsSource | MangaDetailsSource;

		if (!this.state.isAnime) {
			listSource = new MangaDetailsSource(this.state.mediaId, mangaFields);
		} else {
			listSource = new AnimeDetailsSource(this.state.mediaId, animeFields);
		}

		const listStatus = await listSource.MakeRequest();

		this.setState({
			mediaId: this.state.mediaId,
			listStatus: listStatus.myListStatus,
			isEditing: false,
			before: listStatus.myListStatus,
		});
	}

	componentDidMount() {
		changeBackButton(this.state.page, () => {
			this.props.navigation.popToTop();
			changeBackButton(this.state.page, undefined);
		});

		const unsubscribe = this.props.navigation.addListener("focus", () => {
			changeActivePage(this.state.page);
			// The screen is focused
			// Call any action
		});

		this.setState((prevState) => ({
			...prevState,
			listenerToUnMount: unsubscribe,
		}));
	}

	componentWillUnmount() {
		if (this.state.listenerToUnMount) this.state.listenerToUnMount();
	}

	renderAnime(listStatus: AnimeDetailsMyListStatus, styles: AppliedStyles<Styles>, providedTheme: ProvidedTheme) {
		if (this.state.isEditing) return this.animeEditing(listStatus, styles, providedTheme);
		else return this.animeDisplay(listStatus, styles);
	}

	renderManga(listStatus: MangaDetailsMyListStatus, styles: AppliedStyles<Styles>, providedTheme: ProvidedTheme) {
		if (this.state.isEditing) return this.mangaEditing(listStatus, styles, providedTheme);
		else return this.mangaDisplay(listStatus, styles);
	}

	animeDisplay(listStatus: AnimeDetailsMyListStatus, styles: AppliedStyles<Styles>) {
		return (
			<View style={styles.Table}>
				<View style={styles.Labels}>
					<TopAreaLabel>Status:</TopAreaLabel>
					<TopAreaLabel>Watched episodes:</TopAreaLabel>
					<TopAreaLabel>Score:</TopAreaLabel>
					<TopAreaLabel>Priority:</TopAreaLabel>

					<TopAreaLabel></TopAreaLabel>

					<TopAreaLabel>Rewatching:</TopAreaLabel>
					<TopAreaLabel>Num times rewatched:</TopAreaLabel>
					<TopAreaLabel>Rewatch value:</TopAreaLabel>

					<TopAreaLabel></TopAreaLabel>

					<TopAreaLabel>Tags:</TopAreaLabel>
					<TopAreaLabel>Comments:</TopAreaLabel>

					<TopAreaLabel></TopAreaLabel>

					<TopAreaLabel>Updated:</TopAreaLabel>
				</View>
				<View style={styles.Values}>

					<TopAreaValue>{niceTextFormat(listStatus.status?.toString())}</TopAreaValue>
					<TopAreaValue>{listStatus.numEpisodesWatched}</TopAreaValue>
					<TopAreaValue># {listStatus.score}</TopAreaValue>
					<TopAreaValue>{listStatus.priority}</TopAreaValue>

					<TopAreaValue></TopAreaValue>

					<TopAreaValue>
						{listStatus.isRewatching == true ? "yes" : "no"}
					</TopAreaValue>
					<TopAreaValue>{listStatus.numTimesRewatched}</TopAreaValue>
					<TopAreaValue>{listStatus.rewatchValue}</TopAreaValue>

					<TopAreaValue></TopAreaValue>

					<TopAreaValue>
						{listStatus.tags == undefined || listStatus.tags.length == 0
							? "N/A"
							: listStatus.tags.join(", ")}
					</TopAreaValue>
					<TopAreaValue>
						{(listStatus.comments ?? "") == "" ? "N/A" : listStatus.comments}
					</TopAreaValue>

					<TopAreaValue></TopAreaValue>

					<TopAreaValue>
						<TimeAgo time={listStatus.updatedAt ?? ""} interval={5000} />
					</TopAreaValue>
				</View>
			</View>
		);
	}

	animeEditing(listStatus: AnimeDetailsMyListStatus, styles: AppliedStyles<Styles>, providedTheme: ProvidedTheme) {
		const labelStyle = labelTextStyle[1]({
			text: styles.newLabel
		}, providedTheme, {})
		const valueStyle = valueTextStyle[1]({
			text: styles.newValue
		}, providedTheme, {})

		console.log("value style", valueStyle);

		return (
			<View style={styles.newTable}>
				<View style={StyleSheet.flatten([...styles.newPair, ...styles.firstPickerPair])}>

					<Text style={labelStyle}>Status:</Text>
					<View style={styles.newValueContainer}>

						<Picker
							items={Object.entries(AnimeStatus).map(a => ({ label: niceTextFormat(a[1]), value: a[1] }))}
							setValue={(val) => {
								// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
								this.stateManager.changeStatus(val)
							}}
							style={valueStyle as TextStyle}
							value={listStatus.status === undefined ? null : listStatus.status}
							// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
							dropDownBackgroundColor={resolve(colors.colorContainer("secondary"), providedTheme)}
						/>
					</View>
				</View>
				<View style={styles.newPair}>
					<Text style={labelStyle}>Watched episodes:</Text>
					<View style={styles.newValueContainer}>
						<TextInput
							style={valueStyle}
							value={listStatus.numEpisodesWatched?.toString() ?? ""}
							onChangeText={this.stateManager.changeEpisodesWatched.bind(this)}
							keyboardType={"numeric"}
						/>
					</View>
				</View>
				<View style={styles.newPair}>
					<Text style={labelStyle}>Score:</Text>
					<View style={styles.newValueContainer}>
						<TextInput
							style={valueStyle}
							value={listStatus.score?.toString() ?? ""}
							onChangeText={this.stateManager.changeScore.bind(this)}
							keyboardType={"numeric"}
						/>
					</View>
				</View>
				<View style={styles.newPair}>
					<Text style={labelStyle}>Priority:</Text>
					<View style={styles.newValueContainer}>
						<TextInput
							style={valueStyle}
							value={listStatus.priority?.toString() ?? ""}
							onChangeText={this.stateManager.changePriority.bind(this)}
							keyboardType={"numeric"}
						/>
					</View>
				</View>

				<Spacer direction="vertical" spacing="large" />
				<Spacer direction="vertical" spacing="large" />

				<View style={StyleSheet.flatten([...styles.newPair, ...styles.secondPickerPair])}>
					<Text style={labelStyle}>Rewatching:</Text>
					<View style={styles.newValueContainer}>
						<Picker
							items={[{ label: "Yes", value: "true" }, { label: "No", value: "false" }]}
							setValue={(val) => {
								// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
								this.stateManager.changeIsRewatching(val)
							}}
							style={valueStyle as TextStyle}
							value={listStatus.isRewatching === undefined ? null : String(listStatus.isRewatching) as "true" | "false"}
							// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
							dropDownBackgroundColor={resolve(colors.colorContainer("secondary"), providedTheme)}
						/>
					</View>
				</View>
				<View style={styles.newPair}>
					<Text style={labelStyle}>Num times rewatched:</Text>
					<View style={styles.newValueContainer}>
						<TextInput
							style={valueStyle}
							value={listStatus.numTimesRewatched?.toString() ?? ""}
							onChangeText={this.stateManager.changeNumTimesRewatched.bind(this)}
							keyboardType={"numeric"}
						/>
					</View>
				</View>
				<View style={styles.newPair}>
					<Text style={labelStyle}>Rewatch value:</Text>
					<View style={styles.newValueContainer}>
						<TextInput
							style={valueStyle}
							value={listStatus.rewatchValue?.toString() ?? ""}
							onChangeText={this.stateManager.changeRewatchValue.bind(this)}
							keyboardType={"numeric"}
						/>
					</View>
				</View>

				<Spacer direction="vertical" spacing="large" />
				<Spacer direction="vertical" spacing="large" />

				<View style={styles.newPair}>
					<Text style={labelStyle}>Tags:</Text>
					<View style={styles.newValueContainer}>
						<TextInput
							style={valueStyle}
							value={listStatus.tags?.join(" ") ?? ""}
							onChangeText={this.stateManager.changeTags.bind(this)}
							keyboardType={"ascii-capable"}
						/>
					</View>
				</View>
				<View style={styles.newPair}>
					<Text style={labelStyle}>Comments:</Text>
					<View style={styles.newValueContainer}>
						<TextInput
							style={valueStyle}
							value={listStatus.comments ?? ""}
							onChangeText={this.stateManager.changeComments.bind(this)}
							keyboardType={"ascii-capable"}
						/>
					</View>
				</View>

				<Spacer direction="vertical" spacing="large" />
				<Spacer direction="vertical" spacing="large" />

				<View style={styles.newPair}>
					<Text style={labelStyle}>Updated:</Text>
					<View style={styles.newValueContainer}>
						<Text style={valueStyle}>
							<TimeAgo time={listStatus.updatedAt ?? ""} interval={5000} />
						</Text>
					</View>
				</View>
			</View >
		);
	}

	mangaDisplay(listStatus: MangaDetailsMyListStatus, styles: AppliedStyles<Styles>) {
		return (
			<View style={styles.Table}>
				<View style={styles.Labels}>
					<TopAreaLabel>Status:</TopAreaLabel>
					<TopAreaLabel>Chapters read:</TopAreaLabel>
					<TopAreaLabel>Volumes read:</TopAreaLabel>
					<TopAreaLabel>Score:</TopAreaLabel>

					<Spacer direction="vertical" spacing="large" />
					<Spacer direction="vertical" spacing="large" />

					<TopAreaLabel>Rereading:</TopAreaLabel>
					<TopAreaLabel>Number of times reread:</TopAreaLabel>
					<TopAreaLabel>Reread value:</TopAreaLabel>

					<Spacer direction="vertical" spacing="large" />
					<Spacer direction="vertical" spacing="large" />

					<TopAreaLabel>Tags:</TopAreaLabel>
					<TopAreaLabel>Comments:</TopAreaLabel>

					<Spacer direction="vertical" spacing="large" />
					<Spacer direction="vertical" spacing="large" />

					<TopAreaLabel>Updated:</TopAreaLabel>
				</View>
				<View style={styles.Values}>
					<TopAreaValue>{niceTextFormat(listStatus.status?.toString())}</TopAreaValue>
					<TopAreaValue>{listStatus.numChaptersRead}</TopAreaValue>
					<TopAreaValue>{listStatus.numVolumesRead}</TopAreaValue>
					<TopAreaValue># {listStatus.score}</TopAreaValue>

					<Spacer direction="vertical" spacing="large" />
					<Spacer direction="vertical" spacing="large" />

					<TopAreaValue>
						{listStatus.isRereading == true ? "yes" : "no"}
					</TopAreaValue>
					<TopAreaValue>{listStatus.numTimesReread}</TopAreaValue>
					<TopAreaValue>{listStatus.rereadValue}</TopAreaValue>

					<Spacer direction="vertical" spacing="large" />
					<Spacer direction="vertical" spacing="large" />

					<TopAreaValue>
						{listStatus.tags == undefined || listStatus.tags.length == 0
							? "N/A"
							: listStatus.tags.join(", ")}
					</TopAreaValue>
					<TopAreaValue>
						{(listStatus.comments ?? "") == "" ? "N/A" : listStatus.comments}
					</TopAreaValue>

					<Spacer direction="vertical" spacing="large" />
					<Spacer direction="vertical" spacing="large" />

					<TopAreaValue>
						<TimeAgo time={listStatus.updatedAt ?? ""} interval={5000} />
					</TopAreaValue>
				</View>
			</View>
		);
	}
	mangaEditing(listStatus: MangaDetailsMyListStatus, styles: AppliedStyles<Styles>, providedTheme: ProvidedTheme) {
		const labelStyle = labelTextStyle[1]({
			text: styles.newLabel
		}, providedTheme, {})
		const valueStyle = valueTextStyle[1]({
			text: styles.newValue
		}, providedTheme, {})

		if (this.state.listStatus == undefined) return;
		return (
			<View style={styles.newTable}>
				<View style={StyleSheet.flatten([...styles.newPair, ...styles.firstPickerPair])}>
					<Text style={labelStyle}>Status:</Text>
					<View style={styles.newValueContainer}>
						<Picker
							items={Object.entries(MangaStatus).map(a => ({ label: niceTextFormat(a[1]), value: a[1] }))}
							setValue={(val) => {
								// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
								this.stateManager.changeStatus(val)
							}}
							style={valueStyle as TextStyle}
							value={listStatus.status === undefined ? null : listStatus.status}
							// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
							dropDownBackgroundColor={resolve(colors.colorContainer("secondary"), providedTheme)}
						/>
					</View>
				</View>
				<View style={styles.newPair}>
					<Text style={labelStyle}>Chapters read:</Text>
					<View style={styles.newValueContainer}>
						<TextInput
							style={valueStyle}
							value={listStatus.numChaptersRead?.toString() ?? ""}
							onChangeText={this.stateManager.changeChaptersRead.bind(this)}
							keyboardType={"numeric"}
						/>
					</View>
				</View>
				<View style={styles.newPair}>
					<Text style={labelStyle}>Volumes read:</Text>
					<View style={styles.newValueContainer}>
						<TextInput
							style={valueStyle}
							value={listStatus.numVolumesRead?.toString() ?? ""}
							onChangeText={this.stateManager.changeVolumesRead.bind(this)}
							keyboardType={"numeric"}
						/>
					</View>
				</View>

				<View style={styles.newPair}>
					<Text style={labelStyle}>Score:</Text>
					<View style={styles.newValueContainer}>
						<TextInput
							style={valueStyle}
							value={listStatus.score?.toString() ?? ""}
							onChangeText={this.stateManager.changeScore.bind(this)}
							keyboardType={"numeric"}
						/>
					</View>
				</View>
				<View style={styles.newPair}>
					<Text style={labelStyle}>Priority:</Text>
					<View style={styles.newValueContainer}>
						<TextInput
							style={valueStyle}
							value={listStatus.priority?.toString() ?? ""}
							onChangeText={this.stateManager.changePriority.bind(this)}
							keyboardType={"numeric"}
						/>
					</View>
				</View>

				<Spacer direction="vertical" spacing="large" />
				<Spacer direction="vertical" spacing="large" />

				<View style={StyleSheet.flatten([...styles.newPair, ...styles.secondPickerPair])}>
					<Text style={labelStyle}>Rereading:</Text>
					<View style={styles.newValueContainer}>
						<Picker
							items={[{ label: "Yes", value: "true" }, { label: "No", value: "false" }]}
							setValue={(val) => {
								// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
								this.stateManager.changeIsRereading(val)
							}}
							style={valueStyle as TextStyle}
							value={listStatus.isRereading === undefined ? null : String(listStatus.isRereading) as "true" | "false"}
							// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
							dropDownBackgroundColor={resolve(colors.colorContainer("secondary"), providedTheme)}
						/>
					</View>
				</View>
				<View style={styles.newPair}>
					<Text style={labelStyle}>Num times rewatched:</Text>
					<View style={styles.newValueContainer}>
						<TextInput
							style={valueStyle}
							value={listStatus.numTimesReread?.toString() ?? ""}
							onChangeText={this.stateManager.changeNumTimesReread.bind(this)}
							keyboardType={"numeric"}
						/>
					</View>
				</View>
				<View style={styles.newPair}>
					<Text style={labelStyle}>Rewatch value:</Text>
					<View style={styles.newValueContainer}>
						<TextInput
							style={valueStyle}
							value={listStatus.rereadValue?.toString() ?? ""}
							onChangeText={this.stateManager.changeRereadValue.bind(this)}
							keyboardType={"numeric"}
						/>
					</View>
				</View>

				<Spacer direction="vertical" spacing="large" />
				<Spacer direction="vertical" spacing="large" />

				<View style={styles.newPair}>
					<Text style={labelStyle}>Tags:</Text>
					<View style={styles.newValueContainer}>
						<TextInput
							style={valueStyle}
							value={listStatus.tags?.join(" ") ?? ""}
							onChangeText={this.stateManager.changeTags.bind(this)}
							keyboardType={"ascii-capable"}
						/>
					</View>
				</View>
				<View style={styles.newPair}>
					<Text style={labelStyle}>Comments:</Text>
					<View style={styles.newValueContainer}>
						<TextInput
							style={valueStyle}
							value={listStatus.comments ?? ""}
							onChangeText={this.stateManager.changeComments.bind(this)}
							keyboardType={"ascii-capable"}
						/>
					</View>
				</View>

				<Spacer direction="vertical" spacing="large" />
				<Spacer direction="vertical" spacing="large" />

				<View style={styles.newPair}>
					<Text style={labelStyle}>Updated:</Text>
					<View style={styles.newValueContainer}>
						<Text style={valueStyle}>
							<TimeAgo time={listStatus.updatedAt ?? ""} interval={5000} />
						</Text>
					</View>
				</View>
			</View>
		);
	}

	async saveEdit() {
		if (this.state.listStatus == undefined) return;

		if (this.state.isAnime == true) {
			const updateRequest = new UpdateAnimeList();
			await updateRequest.MakeRequest(
				this.state.mediaId,
				this.state.before as AnimeDetailsMyListStatus,
				this.state.listStatus as AnimeDetailsMyListStatus
			)
			await this.refresh();
		} else {
			const updateRequest = new UpdateMangaList();
			await updateRequest.MakeRequest(
				this.state.mediaId,
				this.state.before as MangaDetailsMyListStatus,
				this.state.listStatus as MangaDetailsMyListStatus
			)
			await this.refresh();
		}
	}

	renderThemed(styles: AppliedStyles<Styles>, providedTheme: ProvidedTheme) {
		if (this.state.listStatus == undefined)
			return (<ActivityIndicator
				style={styles.loading}
				size="large"
				color={Colors.BLUE}
			/>);

		return (
			<SafeAreaView style={styles.appContainer}>
				<MainGradientBackground noFlex={true}>
					<ScrollView
						style={styles.page}
						contentContainerStyle={styles.pageContentContainer}>
						{this.state.isAnime
							? this.renderAnime(
								this.state.listStatus as AnimeDetailsMyListStatus,
								styles,
								providedTheme
							)
							: this.renderManga(
								this.state.listStatus as MangaDetailsMyListStatus,
								styles,
								providedTheme
							)}
						{!this.state.isEditing ? (
							<TouchableOpacity
								style={styles.listStatusEdit}
								onPress={() => {
									this.setState({
										...this.state,
										isEditing: true,
									});
								}}
							>
								<Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="button" style={styles.selfAlignCenter}>Edit</Typography>
							</TouchableOpacity>
						) : (
							<TouchableOpacity
								style={styles.listStatusEdit}
								onPress={() => {
									void this.saveEdit();
								}}
							>
								<Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="button" style={styles.selfAlignCenter}>Save</Typography>

							</TouchableOpacity>
						)}
						{this.state.isEditing == true ? (
							<TouchableOpacity
								style={styles.listStatusEdit}
								onPress={() => {
									void this.refresh();
								}}
							>
								<Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="button" style={styles.selfAlignCenter}>Cancel</Typography>

							</TouchableOpacity>
						) : undefined}
					</ScrollView>
				</MainGradientBackground>
			</SafeAreaView >
		);
	}
}

const labelTextStyle = createTypographyStyles(
	topAreaLabelTypographySettings.variant,
	topAreaLabelTypographySettings.textKind,
	topAreaLabelTypographySettings.isOnContainer,
	topAreaLabelTypographySettings.colorVariant);

const valueTextStyle = createTypographyStyles(
	topAreaLabelTypographySettings.variant,
	topAreaLabelTypographySettings.textKind,
	topAreaLabelTypographySettings.isOnContainer,
	topAreaLabelTypographySettings.colorVariant);

type Styles = typeof styles;

const styles = StyleSheet.create({
	appContainer: {
		backgroundColor: Colors.INVISIBLE_BACKGROUND,
	},
	loading: {
		marginTop: sizing.vh(50),
	},
	page: {
		margin: sizing.spacing("medium")
	},
	pageContentContainer: {
		paddingBottom: 80
	},
	Labels: {
		flexDirection: "column",
		flex: 1,
		margin: sizing.spacing("small"),
	},
	Values: {
		flexDirection: "column",
		flex: 1,
		margin: sizing.spacing("small"),
	},
	Table: {
		flexDirection: "row",
	},
	listStatusEdit: {
		width: sizing.vw(100, -20),
		paddingTop: sizing.spacing("large"),
		paddingBottom: sizing.spacing("large"),
		backgroundColor: colors.color("secondary"),
		marginTop: sizing.spacing("large"),
	},
	newLabel: {
		flex: 1,
		textAlignVertical: "center",
		...labelTextStyle[0].text,
		...topAreaLabelStyles.TopAreaLabel
	},
	newValue: {
		flex: 1,
		...valueTextStyle[0].text,
		...topAreaValueStyles.TopAreaValue,
		paddingLeft: sizing.spacing("medium"),
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
		borderRadius: sizing.rounding("extraSmall") as number,
		textAlignVertical: "center",
		backgroundColor: colors.color("secondary"),
		borderWidth: 0
	},
	newPair: {
		height: 50,
		flexDirection: "row",
		width: "100%",
		margin: sizing.spacing("small"),
	},
	firstPickerPair: {
		zIndex: 2000,
	},
	secondPickerPair: {
		zIndex: 1000
	},
	empty: {
		flexDirection: "row",
		flex: 1,
		margin: 6,
	},
	newTable: {
		flexDirection: "column"
	},
	selfAlignCenter: {
		alignSelf: "center",
	},
	newValueContainer: {
		flex: 1,
		marginRight: sizing.spacing("halfMedium")
	}
});
