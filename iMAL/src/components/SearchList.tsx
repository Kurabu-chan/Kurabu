import React from 'react';
import { StyleSheet, FlatList, View, Text } from 'react-native';
import SearchItem, { AnimeNode } from './SearchItem';
import AnimeNodeSource from '../APIManager/AnimeNodeSource';
import { NavigationParams, NavigationRoute } from 'react-navigation';
import { StackNavigationProp } from 'react-navigation-stack/lib/typescript/src/vendor/types';
import { Colors } from '../Configuration/Colors';
import { Dimensions } from 'react-native';

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
    navigator: StackNavigationProp<NavigationRoute<NavigationParams>, NavigationParams>,
    onCreate?: (anime: AnimeList)=>void
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

        if(this.props.onCreate){
            this.props.onCreate(this);
        }        

        this.refresh(this.state.animeNodeSource);     
    }

    public refresh(nodeSource: AnimeNodeSource){
        console.log(this.state.data.length);
        nodeSource.MakeRequest(20).then((data) => {
            this.setState({...this.state, data: data.data});
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
                    horizontal={false}
                    data={this.state.data}
                    onEndReachedThreshold={0.5}
                    onEndReached={this.loadExtra.bind(this)}
                    renderItem={(item) => (
                        <SearchItem item={item.item} navigator={this.state.navigator} />)}
                    keyExtractor={(item,index) => index.toString()}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    animeContainer: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        marginTop: 10,
        marginRight: 10
    },
    title: {
        fontSize: 20,
        textAlign: "center",
        color: Colors.TEXT
    },
    animeList: {
        justifyContent: 'flex-start'
    }
});

export default AnimeList;