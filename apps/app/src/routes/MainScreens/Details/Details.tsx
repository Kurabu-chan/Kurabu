import React from "react";
import { MangaDetailsSource } from "#data/manga/MangaDetailsSource";
import { BackButtonFunctionsType, changeActivePage, changeBackButton, getActivePage } from "#helpers/backButton";
import {
	ActivityIndicator,
	Alert,
	Dimensions,
	FlatList,
	Image,
	SafeAreaView,
	StyleSheet,
	View,
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AnimeDetailsSource } from "#data/anime/AnimeDetailsSource";
import { Divider } from "#comps/themed/Divider";
import { LargeText } from "#comps/LargeText";
import MediaItem from "#comps/MediaItem";
import { Colors } from "#config/Colors";
import { HomeStackParamList } from "../../MainStacks/HomeStack";
import { ListStatus } from "#comps/ListStatus";
import { AnimeDetails, AnimeDetailsMediaTypeEnum, AnimeListData, MangaDetails, MangaDetailsMediaTypeEnum, MangaListData } from "@kurabu/api-sdk";
import { niceDateFormat } from "#helpers/textFormatting";
import { MainGradientBackground } from "#comps/MainGradientBackground";
import { Typography } from "#comps/themed/Typography";
import { TopAreaLabel } from "./components/TopAreaLabel";
import { TopAreaValue } from "./components/TopAreaValue";
import { Spacer } from "#comps/themed/Spacer";
import { AppliedStyles, sizing, ThemedComponent } from "@kurabu/theme";

type Props = {
	navigation: StackNavigationProp<HomeStackParamList, "DetailsScreen">;
	route: RouteProp<HomeStackParamList, "DetailsScreen">;
};

type State = {
	mediaId?: number;
	media?: AnimeDetails | MangaDetails;
	listenerToUnMount?: () => void;
	page: keyof BackButtonFunctionsType;
	mediaType: AnimeDetailsMediaTypeEnum | MangaDetailsMediaTypeEnum;
};

const sizer = Dimensions.get("window").width / 400;

export default class Details extends ThemedComponent<Styles, Props, State> {
	constructor(props: Props) {
		super(styles, props);
		let mediaId = props.route.params.id;
		const mediaType = props.route.params.mediaType;
		if (mediaId == undefined) {
			mediaId = 1;
		}
		console.log(`Showing details for: ${mediaType} ${mediaId}`);
		this.state = {
			mediaId: mediaId,
			listenerToUnMount: undefined,
			page: getActivePage(),
			mediaType: mediaType,
		};

		void this.refresh();
	}

	async refresh() {
		if (this.state.mediaId === undefined) return;

		const mangaMediaTypes: (AnimeDetailsMediaTypeEnum | MangaDetailsMediaTypeEnum)[] = [
			MangaDetailsMediaTypeEnum.Manga,
			MangaDetailsMediaTypeEnum.Doujinshi,
			MangaDetailsMediaTypeEnum.Manhwa,
			MangaDetailsMediaTypeEnum.Manhua,
			MangaDetailsMediaTypeEnum.Oel,
			MangaDetailsMediaTypeEnum.OneShot,
			MangaDetailsMediaTypeEnum.Novel,
			MangaDetailsMediaTypeEnum.OneShot
		];

		let detailsSource: MangaDetailsSource | AnimeDetailsSource;
		if (mangaMediaTypes.includes(this.state.mediaType)) {
			detailsSource = new MangaDetailsSource(this.state.mediaId, []);
		} else {
			detailsSource = new AnimeDetailsSource(this.state.mediaId, []);
		}

		const details = await detailsSource.MakeRequest();

		this.setState({
			mediaId: this.state.mediaId,
			media: details,
		})


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

	niceString(text: string | undefined) {
		if (text == undefined) return "";
		text = text.replace("_", " ");
		return text.slice(0, 1).toUpperCase() + text.slice(1, text.length);
	}

	episodesLabel() {
		if (this.state.media === undefined) {
			return undefined;
		}

		if ("numEpisodes" in this.state.media) {
			return (<View>
				<TopAreaLabel>Episodes:</TopAreaLabel>
			</View>);
		}

		return (<View>
			<TopAreaLabel>Chapters:</TopAreaLabel>
			<TopAreaLabel>Volumes:</TopAreaLabel>
		</View>);
	}

	episodesValue() {
		if (this.state.media === undefined) {
			return undefined;
		}

		if ("numEpisodes" in this.state.media) {
			const media: AnimeDetails = this.state.media;

			return (<View>
				<TopAreaValue>{valueOrND(media.numEpisodes)}</TopAreaValue>
			</View>);
		}

		const media: MangaDetails = this.state.media as MangaDetails;

		return (<View>
			<TopAreaValue>{valueOrND(media.numChapters)}</TopAreaValue>
			<TopAreaValue>{valueOrND(media.numVolumes)}</TopAreaValue>
		</View>);
	}

	renderThemed(styles: AppliedStyles<Styles>) {

		if (this.state.media == undefined) {
			return (
				<SafeAreaView>
					<MainGradientBackground noFlex={true}>
						<ActivityIndicator
							style={styles.loading}
							size="large"
							color={Colors.BLUE}
						/>
					</MainGradientBackground>
				</SafeAreaView>);
		}

		return (
			<SafeAreaView>
				<MainGradientBackground noFlex={false}>
					<ScrollView
						style={styles.page}
						contentContainerStyle={styles.scrollContentContainer}>
						<View style={styles.TopArea}>
							<TouchableOpacity onPress={() => {
								if (this.state.media?.pictures === undefined || this.state.media.pictures.length === 0) {
									Alert.alert("No pictures found");
									return;
								}

								this.props.navigation.push("DetailsImageListScreen", {
									picture: this.state.media?.pictures
								});
							}}>
								<Image
									style={styles.image}
									source={{
										uri: this.state.media?.mainPicture?.large,
									}}
								/>
							</TouchableOpacity>
								
							<View style={styles.TitleArea}>
								<Typography
									colorVariant="primary"
									isOnContainer={false}
									textKind="header"
									variant="headline4" style={styles.title}>
									{this.state.media.title}
								</Typography>
								{this.state.media.title !=
									this.state.media.alternativeTitles?.en ? (
									<Typography
										colorVariant="primary"
										isOnContainer={false}
										textKind="subText"
										variant="headline5" style={styles.alternateTitle}>
										{this.state.media.alternativeTitles?.en}
									</Typography>
								) : undefined}
								<Typography
									colorVariant="primary"
									isOnContainer={false}
									textKind="subText"
									variant="headline5" style={styles.alternateTitle}>
									{this.state.media.alternativeTitles?.ja}
								</Typography>

								<Divider margin={false} variant="primary" isOnContainer={false} widthPercentage={100} />
								<View style={styles.TopAreaData}>
									<View style={styles.TopAreaLabels}>
										<TopAreaLabel>Score:</TopAreaLabel>
										<TopAreaLabel>Rank:</TopAreaLabel>
										<TopAreaLabel>Popularity:</TopAreaLabel>
									</View>
									<View style={styles.TopAreaValues}>
										<TopAreaValue>{this.state.media.mean}</TopAreaValue>
										<TopAreaValue>#{this.state.media.rank}</TopAreaValue>
										<TopAreaValue>#{this.state.media.popularity}</TopAreaValue>
									</View>
								</View>
								<Divider margin={false} variant="primary" isOnContainer={false} widthPercentage={100} />
								<View style={styles.TopAreaData}>
									<View style={styles.TopAreaLabels}>
										<TopAreaLabel>Status:</TopAreaLabel>
										<TopAreaLabel>Aired:</TopAreaLabel>
										{this.episodesLabel()}
										<TopAreaLabel>Genres:</TopAreaLabel>
									</View>
									<View style={styles.TopAreaValues}>
										<TopAreaValue>
											{this.niceString(this.state.media.status?.toString())}
										</TopAreaValue>
										<TopAreaValue>
											{niceDateFormat(this.state.media.startDate)}
										</TopAreaValue>
										{this.episodesValue()}
										<TopAreaValue>
											{this.state.media.genres
												?.map((x) => x.name)
												.join(", ")}
										</TopAreaValue>
									</View>
								</View>
							</View>
						</View>
						<Typography
							colorVariant="primary"
							isOnContainer={false}
							textKind="header"
							variant="headline4">
							Synopsis
						</Typography>
						<Divider margin={false} variant="primary" isOnContainer={false} widthPercentage={100} />
						<LargeText text={this.state.media.synopsis} backgroundColorVariant="background" isOnContainer={false} />
						{this.state.media.background != undefined &&
							this.state.media.background != "" ? (
								<View>
									<Spacer direction="vertical" spacing="large"/>
									<Typography
										colorVariant="primary"
										isOnContainer={false}
										textKind="header"
										variant="headline4">
										Background
									</Typography>
								<Divider margin={false} variant="primary" isOnContainer={false} widthPercentage={100} />
								<LargeText text={this.state.media.background} backgroundColorVariant="background" isOnContainer={false} />
							</View>
						) : undefined}
						<Spacer direction="vertical" spacing="large" />
						<Typography
							colorVariant="primary"
							isOnContainer={false}
							textKind="header"
							variant="headline4">
							Your list status
						</Typography>
						<Divider margin={false} variant="primary" isOnContainer={false} widthPercentage={100} />
						<ListStatus
							parentRefresh={() => {
								void this.refresh();
							}}
							id={this.state.mediaId as number}
							props={this.state.media.myListStatus}
							navigation={this.props.navigation}
							route={this.props.route}
							mediaType={this.state.mediaType}
						/>
						<Spacer direction="vertical" spacing="large" />

						<Typography
							colorVariant="primary"
							isOnContainer={false}
							textKind="header"
							variant="headline4">
							Recommendations
						</Typography>
						<Divider margin={false} variant="primary" isOnContainer={false} widthPercentage={100} />
						<FlatList
							horizontal={true}
							data={this.state.media.recommendations?.map((x) => ({
								...x,
								node: {
									...x.node,
									mediaType: this.state.mediaType,
								},
							} as (AnimeListData | MangaListData)))}
							renderItem={(item) => (
								<MediaItem
									item={item.item}
									width={150 * sizer}
									navigator={this.props.navigation}
								/>
							)}
							keyExtractor={(_, index) => index.toString()}
						/>
						<Divider margin={false} variant="primary" isOnContainer={false} widthPercentage={0} />
					</ScrollView>
				</MainGradientBackground>
			</SafeAreaView>
		);
	}
}

type Styles = typeof styles;
const styles = StyleSheet.create({
	loading: {
		marginTop: sizing.vh(50),
	},
	image: {
		width: sizing.vw(40),
		height: sizing.vw(60),
	},
	title: {
		marginLeft: sizing.spacing("small"),
	},
	alternateTitle: {
		marginLeft: sizing.spacing("small"),
	},
	page: {
		margin: sizing.spacing("medium"),
	},
	TopArea: {
		flexDirection: "row",
		alignItems: "stretch",
		width: sizing.vw(100, -20),
		marginBottom: sizing.spacing("medium"),
	},
	TitleArea: {
		flexDirection: "column",
		marginLeft: sizing.spacing("medium"),
		flex: 1,
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
	scrollContentContainer: {
		paddingBottom: 80
	}
});

function valueOrND(val: number | undefined) {
	return val === 0 || val === undefined ? "N/A" : val;
}
