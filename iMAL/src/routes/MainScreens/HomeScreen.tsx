import React from 'react';
import { FlatList } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AnimeList from '../../components/AnimeList';
import SeasonalSource from '../../APIManager/Seasonal';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import AnimeNodeSource from '../../APIManager/AnimeNodeSource';

type StateType = {
    key: string,
    nodeSource: AnimeNodeSource
}

export default class Home extends React.Component<NavigationStackScreenProps,StateType[]>{
    constructor(props: NavigationStackScreenProps){
        super(props);
        this.state = [
            {
                key: "Summer 2020:",
                nodeSource: new SeasonalSource(2020, "summer")
            },
            {
                key: "Summer 2019:",
                nodeSource: new SeasonalSource(2019, "summer")
            },
            {
                key: "Summer 2018:",
                nodeSource: new SeasonalSource(2018, "summer")
            },
            {
                key: "Summer 2017:",
                nodeSource: new SeasonalSource(2017, "summer")
            }
            ,
            {
                key: "Summer 2016:",
                nodeSource: new SeasonalSource(2016, "summer")
            }
            ,
            {
                key: "Summer 2015:",
                nodeSource: new SeasonalSource(2015, "summer")
            }
        ];        
    }

    render(){
        return (
            <SafeAreaProvider style={{ backgroundColor: "#1a1a1a" }}>
                <FlatList
                    data={this.state}
                    renderItem={(item) => (
                        <AnimeList title={item.item.key}
                            animeNodeSource={item.item.nodeSource}
                            navigator={this.props.navigation} />
                    )} />
            </SafeAreaProvider>      
        );
    }
}