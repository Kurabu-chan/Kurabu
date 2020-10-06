import React from 'react';
import { StyleSheet, FlatList, View, Text } from 'react-native';
import AnimeItem, { AnimeNode } from './AnimeItem';
import AnimeNodeSource from '../APIManager/AnimeNodeSource';
import { NavigationParams, NavigationRoute } from 'react-navigation';
import { StackNavigationProp } from 'react-navigation-stack/lib/typescript/src/vendor/types';

type AnimeListState = {
    title: string,
    data: AnimeNode[],
    animeNodeSource: AnimeNodeSource,
    navigator: StackNavigationProp<NavigationRoute<NavigationParams>, NavigationParams>,
    offset:number
}

type AnimeListProps = {
    title: string,
    animeNodeSource: AnimeNodeSource,
    navigator: StackNavigationProp<NavigationRoute<NavigationParams>, NavigationParams>
}

class AnimeList extends React.Component<AnimeListProps,AnimeListState> {
    constructor(props: AnimeListProps) {
        super(props);
        this.state = {
            title: props.title,
            data: [],
            animeNodeSource: props.animeNodeSource,
            navigator: props.navigator,
            offset:0
        };
        
        this.state.animeNodeSource.MakeRequest(20).then((data) => {
            this.setState(old => {
                old.data.push(...data.data);
            
                return {
                    title: old.title,
                    data: old.data,
                    animeNodeSource: old.animeNodeSource,
                    navigator: old.navigator,
                    offset: old.data.length
                };
            });
        });        
    }

    public loadExtra() {
        this.state.animeNodeSource.MakeRequest(20, this.state.offset).then((data) => {
            this.setState(old => {                
                old.data.push(...data.data);
                
                return {
                    title: old.title,
                    data: old.data,
                    animeNodeSource: old.animeNodeSource,
                    navigator: old.navigator,
                    offset: old.data.length
                };
            });   
        });
    }

    render() {
        return (
            <View style={styles.animeContainer}>
                <Text style={styles.title}>{this.state.title}</Text>
                <FlatList
                    horizontal={true}
                    data={this.state.data}
                    onEndReachedThreshold={0.5}
                    onEndReached={this.loadExtra.bind(this)}
                    renderItem={(item) => (
                        <AnimeItem item={item.item} navigator={this.state.navigator} />)}
                    keyExtractor={(item,index) => index.toString()}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    animeContainer: {
        height: 240,
        marginTop: 10
    },
    title: {
        fontSize: 20,
        marginLeft: 5,
        color: "white"
    },
    animeList: {
        justifyContent: 'flex-start'
    }
});

export default AnimeList;