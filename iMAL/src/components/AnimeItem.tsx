import React from 'react';
import { StyleSheet, FlatList, View, Text, Image, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from 'react-navigation-stack/lib/typescript/src/vendor/types';
import { NavigationRoute, NavigationParams } from 'react-navigation';

export type AnimePicture = {
    medium: string,
    large: string
}

export type AnimeNode = {
    node: {
        id: number,
        title: string,
        main_picture: AnimePicture
    }
}

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
        this.state.navigator.navigate("Details",this.state);
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
        height: 180,
        width:100,
        marginTop: 10,
        marginLeft: 10
    },
    title: {
        fontSize: 14,
        marginLeft: 5,
        color: "white"
    },
    image: {
        width: 100,
        height:150
    }
});
  
export default AnimeItem;