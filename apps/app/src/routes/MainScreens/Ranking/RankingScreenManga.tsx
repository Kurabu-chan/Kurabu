import { MangaRankingSource } from "#data/manga/MangaRankingSource";
import { changeActivePage } from "#helpers/backButton";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MediaListSource } from "#data/MediaListSource";
import { DetailedUpdateItemFields } from "#comps/DetailedUpdateItem";
import SearchList from "#comps/DetailedUpdateList";
import { StackScreenProps } from "@react-navigation/stack";
import { RankingStackParamList } from "#routes/MainStacks/RankingStack";
import { MainGradientBackground } from "#comps/MainGradientBackground";
import { Picker } from "#comps/themed/Picker";
import { AppliedStyles, colors, ProvidedTheme, resolve, sizing, ThemedComponent } from "@kurabu/theme";
import { ThemedStyleSheet } from "#helpers/ThemedStyleSheet";
import { createTypographyStyles } from "#comps/themed/Typography";


type Props = StackScreenProps<RankingStackParamList, "RankingScreen">

type StateType = {
	ranking: {
		rankingValue: string;
		query: string;
		limit?: number;
		offset?: number;
		searched: boolean;
		found: boolean;
	};
	rankingSource?: MediaListSource;
	mangaList?: SearchList;
	listenerToUnMount?: () => void;
};

export default class Ranking extends ThemedComponent<Styles, Props, StateType> {
	constructor(props: Props) {
		super(styles, props);
		this.state = {
			ranking: {
				rankingValue: "all",
				query: "",
				limit: 10,
				offset: 0,
				searched: false,
				found: false,
			},
			listenerToUnMount: undefined,
		};
	}

	componentDidMount() {

		this.DoRanking();

		const unsubscribe = this.props.navigation.addListener("focus", () => {
			changeActivePage("Ranking");
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

	DoRanking() {
		if (this.state.ranking.rankingValue == "") {
			return;
		}

		const fields = DetailedUpdateItemFields;

		const nodeSource = new MangaRankingSource(fields, this.state.ranking.rankingValue);
		this.setState((prevState) => ({
			...prevState,
			rankingSource: nodeSource,
			ranking: {
				...prevState.ranking,
				searched: true,
			},
		}));
		if (this.state.mangaList) {
			const goodNamingMapping: {
				[index: string]: string;
			} = {
				all: "Overall",
				airing: "Airing manga",
				upcoming: "Upcoming manga",
				tv: "Tv",
				ova: "Ova",
				movie: "Movie",
				special: "Special",
				bypopularity: "Popularity",
				favorite: "Favorites",
			};

			console.log(this.state.ranking.rankingValue);
			this.state.mangaList.changeSource(
				`Top ${goodNamingMapping[this.state.ranking.rankingValue]} Rankings`,
				nodeSource
			);
		}
	}

	changeRanking(val: string) {
		this.setState(
			(prevState) =>
			({
				...prevState,
				ranking: {
					...prevState.ranking,
					rankingValue: val,
				},
			} as StateType),
			this.DoRanking.bind(this)
		);
	}

	createSearchBar(styles: AppliedStyles<Styles>, providedTheme: ProvidedTheme) {
		return (
			// <Picker

			//     selectedValue={this.state.ranking.rankingValue}
			//     onValueChange={this.changeRanking.bind(this)}
			//     style={styles.searchBarPicker}
			// >
			//     <Picker.Item label="All" value="all" />
			//     <Picker.Item label="Airing" value="airing" />
			//     <Picker.Item label="Upcoming" value="upcoming" />
			//     <Picker.Item label="Tv" value="tv" />
			//     <Picker.Item label="Ova" value="ova" />
			//     <Picker.Item label="Movie" value="movie" />
			//     <Picker.Item label="Special" value="special" />
			//     <Picker.Item label="Popularity" value="bypopularity" />
			//     <Picker.Item label="Favorite" value="favorite" />
			// </Picker>
			<Picker
				value={this.state.ranking.rankingValue}
				setValue={this.changeRanking.bind(this)}
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				dropDownBackgroundColor={resolve(colors.colorContainer("secondary"), providedTheme)}
				items={[
					{ label: "All", value: "all" },
					{ label: "Manga", value: "manga" },
					{ label: "Oneshots", value: "oneshots" },
					{ label: "Doujin", value: "doujin" },
					{ label: "Lightnovels", value: "lightnovels" },
					{ label: "Novels", value: "novels" },
					{ label: "Manhwa", value: "manhwa" },
					{ label: "Manhua", value: "manhua" },
					{ label: "Bypopularity", value: "bypopularity" },
					{ label: "Favorite", value: "favorite" },
				]}
				style={StyleSheet.flatten(styles.searchBarPicker)}
			/>
		);
	}

	onSearchListCreate(list: SearchList) {
		this.setState((prevState) => ({
			...prevState,
			mangaList: list,
		}));
	}

	onSearchListDataGather() {
		this.setState((prevState) => ({
			...prevState,
			ranking: {
				...prevState.ranking,
				found: true,
			},
		}));
	}

	renderThemed(styles: AppliedStyles<Styles>, providedTheme: ProvidedTheme) {
		return (
			<SafeAreaProvider
				style={styles.safeAreaProvider}
			>
				<MainGradientBackground>
					{this.createSearchBar(styles, providedTheme)}
					{this.state.rankingSource !== undefined ? (
						<SearchList
							title={`Top Overall Rankings`}
							mediaNodeSource={this.state.rankingSource}
							navigator={this.props.navigation}
							onCreate={this.onSearchListCreate.bind(this)}
							onDataGather={this.onSearchListDataGather.bind(this)}
						/>
					) : undefined}
				</MainGradientBackground>
			</SafeAreaProvider>
		);
	}
}

const valueTextStyle = createTypographyStyles(
	"body1",
	"paragraph",
	false,
	"secondary");


type Styles = typeof styles;
const styles = ThemedStyleSheet.create({
	searchBarPicker: {
		...valueTextStyle[0].text,
		paddingLeft: sizing.spacing("medium"),
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
		borderRadius: sizing.rounding("extraSmall") as number,
		textAlignVertical: "center",
		backgroundColor: colors.color("secondary"),
		borderWidth: 0,
		margin: sizing.spacing("medium"),
		width: sizing.vw(100, -20)
	},
	safeAreaProvider: {
		flex: 1
	}
});
