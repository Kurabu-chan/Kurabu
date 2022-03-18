import { Colors } from "#config/Colors";
import { createClearIcon, createSearchIcon } from "#helpers/DefaultIcons";
import { throws } from "assert";
import React from "react";
import { View, Text, Dimensions, ColorValue } from "react-native";
import { Icon, SearchBar } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";

export type Field = {
    name: string,
    possibleValues: {val: string, color?: ColorValue}[],
    subtractable: boolean
}

export type FieldValue = {
    name: string,
    value: string,
    negative: boolean,
    color: ColorValue
}

type Props = {
    fields: Field[],
    /** This function is called before onChange, its only purpose is to verify whether the state is valid. If not valid, on change won't be called. */
    verify: (field: FieldValue[], text: string) => boolean,
    onChange: (field: FieldValue[], text: string) => void,
    search: string,
    currentFields: FieldValue[],
    onSearch: () => void
}

export class FieldSearchBar extends React.Component<Props> {
    private typing: boolean;
    private timeout: NodeJS.Timeout | undefined;

    constructor(props: Props) {
        super(props);
        this.typing = false;
    }

    changeText(search: string) {
        this.typing = true;
        if(this.timeout) clearTimeout(this.timeout);

        this.timeout = setTimeout(() => {
            this.typing = false;
            this.props.onSearch();
        }, 1000);

        

        this.props.onChange(this.props.currentFields, search);
        // extract the fields
        
            
        const [fields, text] = extractFields(search, this.props.fields, this.props.currentFields);

        const currentFields = [...this.props.currentFields, ...fields]

        // verify this is okay
        const verified = this.props.verify(currentFields, text)

        if (!verified) {

            return;
        }

        // call on change
        this.props.onChange(currentFields, text);

        // update the state
        this.setState({
            ...this.state,
            search: text,
            currentFields: currentFields
        });
                      
        


    }

    removeField(field: FieldValue) { 
        let fields = this.props.currentFields; 
        let index = fields.findIndex(f => f.name === field.name && f.value === field.value);
        if (index === -1) return;
        fields.splice(index, 1);
        this.setState({...this.state, currentFields: fields});
    }

    render() {

        var fontSize = Dimensions.get("window").width / 36;

        return (
            <View>
                <SearchBar
                    value={this.props.search}
                    platform={"default"}
                    onBlur={() => { }}
                    onChangeText={((text: string) => { 
                        this.changeText(text);
                    }) as any}
                    onFocus={() => { }}
                    clearIcon={{
                        ...createClearIcon(),
                        name: "search"
                    }}
                    searchIcon={{
                        ...createSearchIcon(),
                        name: "search"
                    }}
                    loadingProps={{}}
                    showLoading={false}
                    onClear={() => {this.props.onChange([], "")}}
                    onCancel={() => { console.log("onCancel") }}
                    lightTheme={false}
                    round={false}
                    cancelButtonTitle={""}
                    cancelButtonProps={{}}
                    onEndEditing={()=>{this.props.onSearch()}}
                    showCancel={false} />
                <View>
                    <View style={{
                        flexDirection: "row",
                        width: Dimensions.get("window").width - 10,
                        flexWrap: "wrap"
                    }}>
                        {
                            this.props.currentFields.map((field, index) => {
                                return (
                                    <View key={index} style={{
                                        padding: 5,
                                        borderRadius: 5,
                                        borderColor: field.color,
                                        backgroundColor: field.color,
                                        width: "auto",
                                        alignSelf: "flex-start",
                                        alignContent: "center",
                                        flexDirection: "row",
                                        margin: 5
                                    }}>
                                        <Text style={{
                                            alignSelf: "flex-start",
                                            fontSize: fontSize*1.1
                                        }}>{field.negative ? "-" : "+"}{field.name}:"{field.value}"</Text>
                                        <TouchableOpacity
                                            onPress={() => { 
                                                this.removeField(field);
                                            }}>
                                            {createClearIcon(fontSize*1.6)}
                                        </TouchableOpacity>
                                    </View>
                                );
                            })
                        }
                    </View>
                    
                </View>
            </View>
        );
    }
}

function extractFields(text: string, fields: Field[], allFields: readonly FieldValue[]): [FieldValue[], string] {
    const find = /[+|-]?[a-zA-Z_-]*:"[a-zA-Z_-\s]*"/g;

    const actualFields: FieldValue[] = []

    const matches = text.match(find);

    if (!matches) return [[], text];
    console.log(matches)
    for (let [_, match] of matches?.entries()) {
        console.log(match);
        let negative = false;
        if (match.startsWith("-")) {
            negative = true;
        }

        if (match.startsWith("+") || match.startsWith("-")) {
            match = match.substring(1);
        }

        const split = match.split(":");

        const fieldName = split[0];
        const fieldValue = split[1].substring(1, split[1].length - 1);

        const field = fields.find(f => f.name === fieldName);
        let fieldValueObject = field?.possibleValues.find(v => v.val === fieldValue);
        if (!fieldValueObject) {
            continue;
        }

        let color = fieldValueObject.color;
        //generate a random color
        if (!color) {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            color = `rgb(${r}, ${g}, ${b})`;
        }
        
        if (!field) {
            continue;
        }

        const newField = {
            name: fieldName,
            value: fieldValue,
            negative: negative,
            color: color
        }

        if (!isValidField([...allFields, ...actualFields], newField)) {
            continue;    
        }

        actualFields.push(newField)
        console.log("match", match)
        text = text.replace(match, "");
    }

    return [
        actualFields,
        text.trimStart()
    ]
} 

function isValidField(list: FieldValue[], field: FieldValue): boolean {
    const sameFieldName = list.filter(f => f.name === field.name);
    if (sameFieldName.length === 0) {
        return true;
    }

    if(sameFieldName[0].negative !== field.negative) {
        return false;
    }

    if(sameFieldName.filter(x => x.value === field.value).length > 0) {
        return false;
    }

    return true;
}