import React from 'react';
import { StyleSheet, FlatList, View, Text, Image, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from 'react-navigation-stack/lib/typescript/src/vendor/types';
import { NavigationRoute, NavigationParams } from 'react-navigation';
import { Colors } from '../Configuration/Colors';
import { AnimeNode } from '../APIManager/ApiBasicTypes';

type AnimeItemProps = {
    item: AnimeNode,
    navigator: StackNavigationProp<NavigationRoute<NavigationParams>, NavigationParams>
}

type AnimeItemState = {
    item: AnimeNode,
    navigator: StackNavigationProp<NavigationRoute<NavigationParams>, NavigationParams>
}

class AnimeItem extends React.Component<AnimeItemProps, AnimeItemState>{
    constructor(props: AnimeItemProps) {
        super(props);

        this.state = {
            item: props.item,
            navigator: props.navigator
        };
    }

    public openDetails() {
        this.state.navigator.push("Details",this.state);
    }

    render() {
        return (        
            <TouchableOpacity style={styles.animeContainer} onPress={this.openDetails.bind(this)}>
                <Image style={styles.image} source={{ uri: this.state.item.node.main_picture.medium }} />
                <Text style={styles.title}>{this.state.item.node.title}</Text>
            </TouchableOpacity>               
        );
    }
}

const styles = StyleSheet.create({
    animeContainer: {
        height: 200,
        width:100,
        marginTop: 10,
        marginLeft: 10
    },
    title: {
        fontSize: 14,
        marginLeft: 5,
        color: Colors.TEXT
    },
    image: {
        width: 100,
        height:150
    }
});
  
export default AnimeItem;