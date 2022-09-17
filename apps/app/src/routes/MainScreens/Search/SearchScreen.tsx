import { changeActivePage } from "#helpers/backButton";
import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { SearchBar } from "react-native-elements";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AnimeSearchSource } from "#data/anime/AnimeSearchSource";
import { MediaListSource } from "#data/MediaListSource";
import { DetailedUpdateItemFields } from "#comps/DetailedUpdateItem";
import SearchList from "#comps/DetailedUpdateList";
import { Colors } from "#config/Colors";
import { StackScreenProps } from "@react-navigation/stack";
import { SearchStackParamList } from "#routes/MainStacks/SearchStack";
import { MainGradientBackground } from "#comps/MainGradientBackground";
import { ThemedSearchBar } from "#comps/themed/SearchBar";

type Props = StackScreenProps<SearchStackParamList, "SearchScreen">;

type StateType = {
	search: {
		searchText: string;
		query: string;
		limit?: number;
		offset?: number;
		searched: boolean;
		found: boolean;
	};
	searchSource?: MediaListSource;
	animeList?: SearchList;
	listenerToUnMount?: () => void;
};

export default class Search extends React.Component<Props, StateType> {
	constructor(props: Props) {
		super(props);
		this.state = {
			search: {
				searchText: "",
				query: "",
				limit: 10,
				offset: 0,
				searched: false,
				found: false,
			},
			listenerToUnMount: undefined,
		};
	}

	DoSearch() {
		console.log(`Searching for ${this.state.search.searchText}`);

		if (this.state.search.searchText == "") {
			return;
		}

		const fields = DetailedUpdateItemFields;

		const nodeSource = new AnimeSearchSource(this.state.search.searchText, fields);
		this.setState((prevState) => ({
			...prevState,
			searchSource: nodeSource,
			search: {
				...prevState.search,
				searched: true,
			},
		}));
		if (this.state.animeList) {
			console.log(this.state.search.searchText);
			this.state.animeList.changeSource(
				`Search results for: ${this.state.search.searchText}`,
				nodeSource
			);
		}
	}

	updateSearch(search: string) {
		this.setState((prevState) => ({
			...prevState,
			search: {
				...prevState.search,
				searchText: search,
			},
		}));
	}

	createSearchBar() {
		return (
			<ThemedSearchBar
				search={this.state.search.searchText}
				runSearch={this.DoSearch.bind(this)}
				title="Search for an anime title"
				changeText={this.updateSearch.bind(this)}
				clearSearch={() => {
					this.updateSearch("");
				}}
			/>
		);
	}

	componentDidMount() {
		const unsubscribe = this.props.navigation.addListener("focus", () => {
			changeActivePage("Search");
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

	onSearchListCreate(list: SearchList) {
		this.setState((prevState) => ({
			...prevState,
			animeList: list,
		}));
	}

	onSearchListDataGather() {
		this.setState((prevState) => ({
			...prevState,
			search: {
				...prevState.search,
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
					{this.state.searchSource !== undefined ? (
						<SearchList
							title={`Search results for: ${this.state.search.searchText}`}
							mediaNodeSource={this.state.searchSource}
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

const styles = StyleSheet.create({
	safeAreaProvider: {
		backgroundColor: Colors.ALTERNATE_BACKGROUND,
		flex: 1
	}
});
