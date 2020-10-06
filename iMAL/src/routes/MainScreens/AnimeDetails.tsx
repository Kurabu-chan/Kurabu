import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { AnimeNode } from '../../components/AnimeItem';

//TODO Everything
export default class AnimeDetails extends React.Component<NavigationStackScreenProps, AnimeNode>{
    private styles = StyleSheet.create({
        appContainer: {
            backgroundColor: "#1a1a1a"
        }
    });

    constructor(props: NavigationStackScreenProps){
        super(props);
        this.state = (props.navigation.getParam("item") as AnimeNode);
    }

    render(){
        return (
            <SafeAreaProvider style={this.styles.appContainer}> 
              <Text>{this.state.node.title}</Text>
            </SafeAreaProvider>      
        );
    }
}