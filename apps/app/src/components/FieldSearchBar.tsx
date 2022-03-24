import { Colors } from "#config/Colors";
import { createClearIcon, createSearchIcon } from "#helpers/DefaultIcons";
import { throws } from "assert";
import React from "react";
import { View, Text, Dimensions, ColorValue, StyleProp, TextStyle, ViewStyle } from "react-native";
import { Icon, SearchBar } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";

export type Field = {
    name: string,
    possibleValues: { val: string, color?: ColorValue }[],
    subtractable: boolean
}

export type FieldValue = {
    name: string,
    value: string,
    negative?: boolean,
    color: ColorValue
}

type Props = {
    fields: Field[],
    /** This function is called before onChange, its only purpose is to verify whether the state is valid. If not valid, on change won't be called. */
    verify: (field: FieldValue[], text: string) => boolean,
    onChange: (field: FieldValue[], text: string) => void,
    search: string,
    currentFields: FieldValue[],
    onSearch: () => void,
    styles: {
        style?: StyleProp<TextStyle>,
        inputStyle?: StyleProp<TextStyle>,
        labelStyle?: StyleProp<TextStyle>,
        inputContainerStyle?: StyleProp<ViewStyle>,
        containerStyle?: StyleProp<ViewStyle>,
        leftIconContainerStyle?: StyleProp<ViewStyle>,
        clearIconStyle?: TextStyle | ViewStyle,
        searchIconStyle?: TextStyle | ViewStyle,
    }
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
        if (this.timeout) clearTimeout(this.timeout);

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
        const fields = this.props.currentFields;
        const index = fields.findIndex(f => f.name === field.name && f.value === field.value);
        if (index === -1) return;
        fields.splice(index, 1);
        this.setState({ ...this.state, currentFields: fields }, () => {
            this.props.onChange(fields, this.props.search);
            this.props.onSearch();
        });
    }

    render() {

        const fontSize = Dimensions.get("window").width / 36;

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
                        ...createClearIcon(undefined, this.props.styles.clearIconStyle),
                        name: "search"
                    }}
                    searchIcon={{
                        ...createSearchIcon(undefined, this.props.styles.searchIconStyle),
                        name: "search"
                    }}
                    loadingProps={{}}
                    showLoading={false}
                    onClear={() => { this.props.onChange([], "") }}
                    onCancel={() => { console.log("onCancel") }}
                    lightTheme={false}
                    round={false}
                    cancelButtonTitle={""}
                    cancelButtonProps={{}}
                    onEndEditing={() => { this.props.onSearch() }}
                    showCancel={false}

                    style={this.props.styles.style}
                    inputStyle={this.props.styles.inputStyle}
                    labelStyle={this.props.styles.labelStyle}
                    inputContainerStyle={this.props.styles.inputContainerStyle}
                    containerStyle={this.props.styles.containerStyle}
                    leftIconContainerStyle={this.props.styles.leftIconContainerStyle}
                />

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
                                            fontSize: fontSize * 1.1
                                        }}>{field.negative ? "-" : "+"}{field.name}: {field.value}</Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.removeField(field);
                                            }}>
                                            {createClearIcon(fontSize * 1.6)}
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

function isValidField(field: Omit<FieldValue, "color">, allowedFields: Field[], currentFields: FieldValue[]): [boolean, FieldValue | undefined] {
    for (const f of currentFields) {
        if (f.name === field.name) {
            if (f.negative !== field.negative && (f.negative == true || field.negative == false)) {
                return [false, undefined];
            }
            if (f.value === field.value) {
                return [false, undefined];
            }
        }
    }

    for (const f of allowedFields) {
        if (f.name === field.name) {
            if (f.subtractable == false && field.negative == true) return [false, undefined];

            if (f.possibleValues.length === 0) {
                const color = Colors.CYAN;

                const actualField: FieldValue = {
                    color: color,
                    name: field.name,
                    value: field.value,
                    negative: field.negative
                }
                return [true, actualField];
            }

            for (const fieldVal of f.possibleValues) {
                if (fieldVal.val === field.value) {
                    const color = fieldVal.color ? fieldVal.color : Colors.CYAN;

                    const actualField: FieldValue = {
                        color: color,
                        name: field.name,
                        value: field.value,
                        negative: field.negative
                    }
                    return [true, actualField];
                }
            }
            return [false, undefined];
        }
    }

    return [false, undefined];
}

function extractFields(search: string, allowedFields: Field[], currentFields: FieldValue[]): [FieldValue[], string] {
    let text = "";
    const fields: FieldValue[] = []

    type State = {
        current: string,
        foundColon: boolean,
        foundOpeningQuote: boolean,
        negative: undefined | boolean,
        fieldName: string
    }

    const state: State = {
        current: "",
        foundColon: false,
        foundOpeningQuote: false,
        negative: undefined,
        fieldName: ""
    }

    for (const c of search) {
        if (c === "+") {
            text += state.current;
            state.current = "";
            state.negative = false;
            continue;
        }
        if (c === "-") {
            text += state.current;
            state.current = "";
            state.negative = true;
            continue;
        }

        if (c === ":") {
            state.foundColon = true;
            continue;
        }

        if (c === "\"") {
            if (state.foundOpeningQuote === true) {
                const currentField = {
                    name: state.fieldName,
                    value: state.current,
                    negative: state.negative
                }

                const validField = isValidField(currentField, allowedFields, [...currentFields, ...fields]);

                if (!validField[0]) {
                    return [[], search];
                }

                if (validField[1] === undefined) throw new Error("Unexpected error in extractFields");

                fields.push(validField[1] );
                state.fieldName = "";
                state.current = "";
                state.negative = undefined;
                state.foundOpeningQuote = false;
                continue;
            }

            if (state.foundColon) {
                state.foundOpeningQuote = true;
                state.foundColon = false;
                state.fieldName = state.current;
                state.current = "";
                continue;
            }

            return [[], search];
        }

        if (c === " ") {
            if (state.foundOpeningQuote) {
                state.current += " ";
                continue;
            }

            if (state.foundColon) {
                state.current += ":";
                state.foundColon = false;
            }

            if (state.current === "") continue;

            text += state.current + " ";
            state.current = "";
            continue;
        }

        if (state.foundColon) {
            state.current += ":";
            state.foundColon = false;
            state.negative = undefined;
        }
        state.current += c;
        continue;
    }

    if (state.foundOpeningQuote) {
        return [[], search];
    }

    if (state.foundColon) {
        state.current += ":"
    }

    text += state.current;

    if (text.trim() === "" && fields.length === 0) return [[], search];

    if (text[text.length - 1] === " ") text = text.slice(0, text.length - 1);

    return [fields, text];
}