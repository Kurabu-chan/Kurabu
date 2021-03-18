import React from 'react';
import SearchBar from 'react-native-dynamic-search-bar';
import { Dimensions, FlatList, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AnimeList from '../../components/AnimeList';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import AnimeNodeSource from '../../APIManager/AnimeNodeSource';
import { Colors } from '../../Configuration/Colors';
import { AnimeNode } from '../../APIManager/ApiBasicTypes';
import { SearchSource } from '../../APIManager/AnimeSearch';

type StateType = {
    search: {
        searchText: string,
        query: string,
        limit?: number,
        offset?: number
    },
    searchSource?: AnimeNodeSource,
    animeList?: AnimeList
}

export default class Home extends React.Component<NavigationStackScreenProps, StateType>{
    constructor(props: NavigationStackScreenProps) {
        super(props);
        this.state = {
            search:
            {
                searchText: '',
                query: '',
                limit: 10,
                offset: 0
            }
        };
    }

    async DoSearch() {
        var nodeSource = new SearchSource(this.state.search.searchText);
        this.setState({ ...this.state, searchSource: nodeSource })
        if(this.state.animeList){
            console.log(this.state.search.searchText)
            this.state.animeList.setState({
                ...this.state.animeList.state,
                title: `Search results for "${this.state.search.searchText}"`,
                animeNodeSource: nodeSource,
                data: []
            });
            this.state.animeList.refresh(nodeSource)
            console.log("Refreshing")
        }
    }

    render() {
        return (
            <SafeAreaProvider style={{ backgroundColor: "#1a1a1a" }}>
                <SearchBar
                    placeholder="Search for an Anime Title.."
                    placeholderTextColor={
                        Colors.TEXT
                    }
                    searchIconImageStyle={{
                        tintColor: Colors.TEXT
                    }}
                    clearIconImageStyle={{
                        tintColor: Colors.TEXT
                    }}
                    textInputStyle={{
                        color: Colors.TEXT
                    }}
                    style={{
                        backgroundColor: Colors.CYAN,
                        marginTop: 5,
                        marginLeft: 5,
                        marginRight: 5,
                        width: Dimensions.get('window').width - 10
                    }}
                    onChangeText={(text) => this.setState(
                        {
                            ...this.state,
                            search:
                            {
                                ...this.state.search,
                                searchText: text
                            }
                        }
                    )}
                    onClearPress={() => this.setState(
                        {
                            ...this.state,
                            search:
                            {
                                ...this.state.search,
                                searchText: ""
                            }
                        }
                    )}
                    onSearchPress={this.DoSearch.bind(this)}
                    onEndEditing={this.DoSearch.bind(this)}
                />
                {this.state.searchSource !== undefined ?
                    <AnimeList title={`Search results for "${this.state.search.searchText}"`}
                        animeNodeSource={this.state.searchSource}
                        navigator={this.props.navigation}
                        onCreate={(list)=>{this.setState({...this.state, animeList: list})}} />
                    : undefined}
            </SafeAreaProvider>
        );
    }
}

// const pageStyles = StyleSheet.create({
//     searchBar: {
//         paddingTop: 10
//     }
// });