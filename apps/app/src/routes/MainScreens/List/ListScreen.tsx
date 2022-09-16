import { changeActivePage } from "#helpers/backButton";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MediaListSource } from "#data/MediaListSource";
import SearchList from "#comps/DetailedUpdateList";
import { Colors } from "#config/Colors";
import { AnimeListSource } from "#data/anime/AnimeListSource";
import { FieldSearchBar, FieldValue } from "#comps/FieldSearchBar";
import { StackNavigationProp } from "@react-navigation/stack";
import { ListStackParamList } from "#routes/MainStacks/ListStack";
import { MainGradientBackground } from "#comps/MainGradientBackground";
import { colors, ThemeApplier } from "@kurabu/theme";

type Props = {
	navigation: StackNavigationProp<ListStackParamList, "ListScreen">;
}

type StateType = {
	filter: {
		fields: FieldValue[];
		search: string;
		limit?: number;
		offset?: number;
		searched: boolean;
		found: boolean;
	};
	rankingSource?: MediaListSource;
	animeList?: SearchList;
	listenerToUnMount?: () => void;
};

export default class List extends React.Component<Props, StateType> {
	constructor(props: Props) {
		super(props);
		this.state = {
			filter: {
				fields: [
					{
						name: "status",
						negative: false,
						value: "watching"
					},
					{
						name: "sort",
						negative: false,
						value: "status"
					}
				],
				search: "",
				limit: 1000000,
				offset: 0,
				searched: false,
				found: false,
			},
			listenerToUnMount: undefined,
		};
	}

	componentDidMount() {
		this.doSearch();

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


	doSearch() {
		// start searching
		let status: string[] | undefined = [];
		const statusFields = this.state.filter.fields.filter((field) => field.name === "status");
		if (statusFields === undefined || statusFields.length == 0) {
			status = undefined
		} else {
			if (statusFields[0].negative) {
				status = ["completed", "dropped", "on_hold", "plan_to_watch", "watching"];

				const remove = statusFields.map(x => x.value)
				status = status.filter(x => !remove.includes(x.replace(/\s/g, "_")));
			} else {
				status = statusFields.map(x => x.value.replace(/\s/g, "_"))
			}
		}


		const nodeSource = new AnimeListSource(this.state.filter.search, status, "status");
		this.setState((prevState) => ({
			...prevState,
			rankingSource: nodeSource,
			filter: {
				...prevState.filter,
				searched: true,
			},
		}));

		this.state.animeList?.changeSource(`Your anime list`, nodeSource);
	}

	// updateSearch(text: string) {
	//     const extracted = extractSearch(text);

	//     this.setState({
	//         ...this.state,
	//         filter: {
	//             ...this.state.filter,
	//             query: text,
	//             search: extracted.search,
	//             status: extracted.status,
	//         }
	//     });

	//     this.doSearch();
	// }

	createSearchBar() {
		return (
			<ThemeApplier style={{
				watching: {
					color: colors.labels(0),
				},
				plan_to_watch: {
					color: colors.labels(1),
				},
				on_hold: {
					color: colors.labels(2),
				},
				dropped: {
					color: colors.labels(3),
				},
				completed: {
					color: colors.labels(4),
				},
				sort: {
					color: colors.labels(5),
				}
			}}>
				{(colors) => (
					<FieldSearchBar
						mediaType="anime"
						fields={[
							{
								name: "status",
								possibleValues: [
									{
										val: "watching",
										color: StyleSheet.flatten(colors.styles.watching).color
									},
									{
										val: "plan to watch",
										color: StyleSheet.flatten(colors.styles.plan_to_watch).color
									},
									{
										val: "completed",
										color: StyleSheet.flatten(colors.styles.completed).color
									},
									{
										val: "dropped",
										color: StyleSheet.flatten(colors.styles.dropped).color
									},
									{
										val: "on hold",
										color: StyleSheet.flatten(colors.styles.on_hold).color
									}
								],
								subtractable: true
							},
							{
								name: "sort",
								possibleValues: [
									{
										val: "status",
										color: StyleSheet.flatten(colors.styles.on_hold).color
									}
								],
								subtractable: true
							}
						]}
						onChange={(fields: FieldValue[], text: string, search: boolean) => {
							this.setState({
								...this.state,
								filter: {
									...this.state.filter,
									search: text,
									fields: fields,
								}
							}, () => {
								if (search) {
									this.doSearch();
								}
							})
						}}
						verify={() => { return true; }}
						search={this.state.filter.search}
						currentFields={this.state.filter.fields}
						onSearch={this.doSearch.bind(this)}
					/>
				)}
			</ThemeApplier>
		);
	}

	onSearchListCreate(list: SearchList) {
		this.setState((prevState) => ({
			...prevState,
			animeList: list,
		}));
	}
	onSearchListDataGather() {
		this.setState((prevState) => ({
			...prevState,
			filter: {
				...prevState.filter,
				found: true,
			},
		}));
	}

	render() {
		return (
			<SafeAreaProvider
				style={styles.safeAreaProvider}
			>
				<MainGradientBackground>
					{this.createSearchBar()}
					{this.state.rankingSource !== undefined ? (
						<SearchList
							title={`Your anime list`}
							mediaNodeSource={this.state.rankingSource}
							navigator={this.props.navigation}
							onCreate={this.onSearchListCreate.bind(this)}
							onDataGather={this.onSearchListDataGather.bind(this)}
							showListStatus={true}
							limit={10000}
						/>
					) : undefined}
				</MainGradientBackground>
			</SafeAreaProvider>
		);
	}
}

const styles = StyleSheet.create({
	safeAreaProvider: {
		backgroundColor: Colors.ALTERNATE_BACKGROUND,
		flex: 1
	}
})
