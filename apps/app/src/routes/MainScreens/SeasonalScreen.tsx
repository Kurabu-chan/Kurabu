import { DetailedUpdateItemFields } from "#comps/DetailedUpdateItem";
import DetailedUpdateList from "#comps/DetailedUpdateList";
import { MainGradientBackground } from "#comps/MainGradientBackground";
import { Picker } from "#comps/themed/Picker";
import { createTypographyStyles } from "#comps/themed/Typography";
import { Colors } from "#config/Colors";
import { AnimeSeasonalSource } from "#data/anime/AnimeSeasonalSource";
import { MediaListSource } from "#data/MediaListSource";
import { changeActivePage } from "#helpers/backButton";
import { niceTextFormat } from "#helpers/textFormatting";
import { SeasonalStackParamList } from "#routes/MainStacks/SeasonalStack";
import { GetSeasonalAnimesSeasonEnum } from "@kurabu/api-sdk";
import { AppliedStyles, colors, ProvidedTheme, resolve, sizing, ThemedComponent } from "@kurabu/theme";
import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

type Props = StackScreenProps<SeasonalStackParamList, "SeasonalScreen">

type StateType = {
	seasonal: {
		seasonValue: GetSeasonalAnimesSeasonEnum;
		yearValue: number;
		limit?: number;
		offset?: number;
		searched: boolean;
		found: boolean;
	};
	rankingSource?: MediaListSource;
	animeList?: DetailedUpdateList;
	listenerToUnMount?: () => void;
};

const currYear = new Date().getFullYear();
const currSeason = getSeason();

export default class Seasonal extends ThemedComponent<Styles, Props, StateType> {
	constructor(props: Props) {
		super(styles, props);
		this.state = {
			seasonal: {
				seasonValue: currSeason,
				yearValue: currYear,
				limit: 10,
				offset: 0,
				searched: false,
				found: false,
			},
			listenerToUnMount: undefined,
		};
	}

	componentDidMount() {

		this.DoSeasonal();

		const unsubscribe = this.props.navigation.addListener("focus", () => {
			changeActivePage("Seasonal");
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

	DoSeasonal() {
		const fields = DetailedUpdateItemFields;

		const nodeSource = new AnimeSeasonalSource(
			fields,
			this.state.seasonal.yearValue,
			this.state.seasonal.seasonValue,
		);
		this.setState((prevState) => ({
			...prevState,
			rankingSource: nodeSource,
			seasonal: {
				...prevState.seasonal,
				searched: true,
			},
		}));
		if (this.state.animeList) {
			console.log(this.state.seasonal.seasonValue);
			this.state.animeList.changeSource(
				`${capitalizeFirstLetter(this.state.seasonal.seasonValue)} ${this.state.seasonal.yearValue
				}`,
				nodeSource
			);
		}
	}

	changeSeason(val: string) {
		const season = val.toString();
		if (!["winter", "summer", "spring", "fall"].includes(season)) {
			return;
		}

		this.setState(
			(prevState) =>
			({
				...prevState,
				seasonal: {
					...prevState.seasonal,
					seasonValue: season,
				},
			} as StateType),
			this.DoSeasonal.bind(this)
		);
	}

	changeYear(val: string) {
		const year = parseInt(val.toString());
		if (year < 1917 || year > currYear + 1) {
			return;
		}

		let seasonValue = getMaxSeasonForYear(year)

		if (seasonToNr(this.state.seasonal.seasonValue) <= seasonToNr(seasonValue)) {
			seasonValue = this.state.seasonal.seasonValue
		}

		this.setState(
			(prevState) =>
			({
				...prevState,
				seasonal: {
					...prevState.seasonal,
					yearValue: year,
					seasonValue: seasonValue
				},
			} as StateType),
			this.DoSeasonal.bind(this)
		);
	}

	createSearchBar(styles: AppliedStyles<Styles>, providedTheme: ProvidedTheme) {
		const allowedSeasons = getAllowedSeasons(getMaxSeasonForYear(this.state.seasonal.yearValue));

		return (
			<View style={styles.searchBarContainer}>
				{/* <Picker
                    selectedValue={this.state.seasonal.seasonValue}
                    onValueChange={this.changeSeason.bind(this)}
                    style={styles.searchBarPicker}
                >
                    <Picker.Item label="Winter" value="winter" />
                    {allowedSeasons.includes("spring") ? (
                        <Picker.Item label="Spring" value="spring" />
                    ) : undefined}
                    {allowedSeasons.includes("summer") ? (
                        <Picker.Item label="Summer" value="summer" />
                    ) : undefined}
                    {allowedSeasons.includes("fall") ? (
                        <Picker.Item label="Fall" value="fall" />
                    ) : undefined}
                </Picker>
                <Picker
                    selectedValue={this.state.seasonal.yearValue.toString()}
                    onValueChange={this.changeYear.bind(this)}
                    style={styles.searchBarPicker}
                >
                    {arrayFromXToY(1917, maxYear(this.state.seasonal.seasonValue) + 1)
                        .reverse()
                        .map((x) => (
                            <Picker.Item
                                key={x.toString()}
                                label={x.toString()}
                                value={x.toString()}
                            />
                        ))}
                </Picker> */}
				<View>

					<Picker

						value={this.state.seasonal.seasonValue}
						items={allowedSeasons.map(x => ({ label: niceTextFormat(x), value: x }))}
						setValue={this.changeSeason.bind(this)}
						style={StyleSheet.flatten(styles.searchBarPicker)}
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						dropDownBackgroundColor={resolve(colors.colorContainer("secondary"), providedTheme)}
					/>
				</View>

				<View>

					<Picker

						value={String(this.state.seasonal.yearValue)}
						items={arrayFromXToY(1917, getMaxYear() + 1)
							.reverse()
							.map(x => ({ label: String(x), value: String(x) }))}
						setValue={this.changeYear.bind(this)}
						style={StyleSheet.flatten(styles.searchBarPicker)}
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						dropDownBackgroundColor={resolve(colors.colorContainer("secondary"), providedTheme)}
					/>
				</View>
			</View>
		);
	}

	onSearchListCreate(list: DetailedUpdateList) {
		this.setState((prevState) => ({
			...prevState,
			animeList: list,
		}));
	}

	onSearchListDataGather() {
		this.setState((prevState) => ({
			...prevState,
			seasonal: {
				...prevState.seasonal,
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
						<DetailedUpdateList
							title={`${capitalizeFirstLetter(this.state.seasonal.seasonValue)} ${this.state.seasonal.yearValue
								}`}
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
const styles = StyleSheet.create({
	searchBarContainer: {
		flexDirection: "row",
	},
	searchBarPicker: {
		...valueTextStyle[0].text,
		paddingLeft: sizing.spacing("medium"),
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
		borderRadius: sizing.rounding("extraSmall") as number,
		textAlignVertical: "center",
		backgroundColor: colors.color("secondary"),
		borderWidth: 0,
		margin: sizing.spacing("medium"),
		width: sizing.vw(50, -20)
	},
	safeAreaProvider: {
		backgroundColor: Colors.ALTERNATE_BACKGROUND,
		flex: 1
	}
});


function arrayFromXToY(x: number, y: number) {
	return Array.from(Array(y - x).keys()).map((z) => z + x);
}

function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

type seasons = "winter" | "summer" | "spring" | "fall";
function getYear(): number {
	return new Date().getFullYear();
}

function getSeason(): GetSeasonalAnimesSeasonEnum {
	const month = new Date().getMonth();
	switch (month) {
		case 12:
		case 1:
		case 2:
			return GetSeasonalAnimesSeasonEnum.Winter;
		case 3:
		case 4:
		case 5:
			return GetSeasonalAnimesSeasonEnum.Spring;
		case 6:
		case 7:
		case 8:
			return GetSeasonalAnimesSeasonEnum.Summer;
		case 9:
		case 10:
		case 11:
			return GetSeasonalAnimesSeasonEnum.Fall;
		default:
			return GetSeasonalAnimesSeasonEnum.Fall;
	}
}

function getAllowedSeasons(maxSeason: seasons): seasons[] {
	console.log(maxSeason)
	switch (maxSeason) {
		case "winter":
			return ["winter"];
		case "spring":
			return ["winter", "spring"];
		case "summer":
			return ["winter", "spring", "summer"];
		default:
			return ["winter", "spring", "summer", "fall"];
	}
}

function seasonToNr(season: seasons): number {
	switch (season) {
		case "winter":
			return 0;
		case "spring":
			return 1;
		case "summer":
			return 2;
		case "fall":
			return 3;
	}
}

function NrToSeason(nr: number): seasons {
	switch (nr % 4) {
		case 0:
			return "winter";
		case 1:
			return "spring";
		case 2:
			return "summer";
		case 3:
			return "fall";
		default:
			return "winter";
	}
}

type MonthYear = {
	year: number;
	season: seasons;
	seasonNr: number;
}

function getMaxSeasonForYear(year: number) {
	const maxYear = getMaxYear();
	
	if (year == maxYear) {
		return getMaxSeason();
	} else {
		return "fall";
	}
}

function getMaxYear() {
	const season = getSeason();
	const year = getYear();

	const max = addMonths({
		season: season,
		seasonNr: seasonToNr(season),
		year: year,
	}, 2);

	return max.year;
}

function getMaxSeason() {
	const season = getSeason();
	const year = getYear();

	const max = addMonths({
		season: season,
		seasonNr: seasonToNr(season),
		year: year,
	}, 2);

	return max.season;
}


function addMonths(my: MonthYear, months: number) {
	if (my.seasonNr + months > 3) {
		const newYear = Math.floor((my.seasonNr + months) / 3) + my.year;
		const newSeasonNr = (my.seasonNr + months) % 3;
		const newSeason = NrToSeason(newSeasonNr);

		return {
			year: newYear,
			season: newSeason,
			seasonNr: newSeasonNr,
		};
	}

	return {
		year: my.year,
		season: NrToSeason(my.seasonNr + months),
		seasonNr: my.seasonNr + months
	}
}
