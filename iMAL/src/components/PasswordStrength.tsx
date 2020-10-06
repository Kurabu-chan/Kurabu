import React from 'react';
import { View,StyleSheet } from 'react-native';

type props = {
    pass: string
}

type state = {
    innerStyle: any
}

export default class PasswordStrength extends React.Component<props,state> {
    constructor(props: props){
        super(props)
        this.state = {
            innerStyle: {
                backgroundColor: 'red',
                height: 20,
                width: "0%",
                borderRadius: 10
            }
        }
    }

    private GetStrength(): number{
        let strength = 0;
        const regexes = [
            /(?=[a-z])/, //at least 1 lower case
            /(?=[A-Z])/, //at least 1 upper case
            /(?=[\W])/, //at least one other character
            /(?=[\d])/, //at least one digit
            /.{8,}/, //length at least 8
            /(?=(.*[a-z]){4,})/, //at least 4 lower case
            /(?=(.*[A-Z]){2,})/, //at least 2 upper case
            /(?=(.*[\W]){2,})/, //at least 2 other characters
            /(?=(.*[\d]){2,})/, //at least 2 digits
            /.{16,}/ //length at least 16
        ];

        //look at all regexes and check if they match
        regexes.forEach((reg)=>{
            if(this.props.pass.match(reg)){
                // add strength if they match
                strength += 0.1;
            }
        });

        return strength;
    }

    componentDidUpdate(prevProps: props){
        if(prevProps.pass === this.props.pass) return;

        let strength = this.GetStrength();
        let color = '#F00';
        if(strength >= 0.5){
            color = "#f70"
        }
        if(strength >= 0.6){
            color = "#fc0"
        }
        if(strength >= 0.7){
            color= "#FF0"
        }
        if(strength >= 0.8){
            color= "#0F0"
        }
        if(strength >= 0.9){
            color = "#00F"
        }

        this.setState(
            {
                innerStyle: {
                    backgroundColor: color,
                    height: 10,
                    width: Math.round(strength * 100).toString() + "%",
                    borderRadius: 5
                }
            }
        );               
    }

    render(){
        return (
            <View style={styles.outer}>
                <View style={this.state.innerStyle}></View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    outer: {
        backgroundColor: "#bbb",
        height: 10,
        width: '60%',
        marginTop: 5,
        borderRadius: 5
    }
});