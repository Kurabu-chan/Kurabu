import { Colors } from "#config/Colors";
import { createClearIcon, createSearchIcon } from "#helpers/DefaultIcons";
import React from "react";
import { View, Text, Dimensions, ColorValue, StyleProp, TextStyle, ViewStyle, StyleSheet, Modal, TouchableOpacity, TouchableHighlight, Alert } from "react-native";
import { Icon, SearchBar } from "react-native-elements";

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
    onChange: (field: FieldValue[], text: string, search: boolean) => void,
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

type State = {
    filtering: boolean,
    filterIndex: number | false,

}

export class FieldSearchBar extends React.Component<Props, State> {
    private typing: boolean;
    private timeout: NodeJS.Timeout | undefined;

    constructor(props: Props) {
        super(props);
        this.typing = false;
        this.state = {
            filtering: false,
            filterIndex: false
        }
    }

    changeText(search: string) {
        this.typing = true;
        if (this.timeout) clearTimeout(this.timeout);

        this.timeout = setTimeout(() => {
            this.typing = false;
            this.props.onSearch();
        }, 1000);


        this.props.onChange(this.props.currentFields, search, false);
        // extract the fields

        const [fields, text] = extractFields(search, this.props.fields, this.props.currentFields);

        const currentFields = [...this.props.currentFields, ...fields]

        // verify this is okay
        const verified = this.props.verify(currentFields, text)

        if (!verified) {

            return;
        }

        // call on change
        this.props.onChange(currentFields, text, false);

        // update the state
        // this.setState({
        //     ...this.state,
        //     search: text,
        //     currentFields: currentFields
        // });
    }

    removeField(field: FieldValue) {
        const fields = this.props.currentFields;
        const index = fields.findIndex(f => f.name === field.name && f.value === field.value);
        if (index === -1) return;
        fields.splice(index, 1);
        this.props.onChange(fields, this.props.search, true);
    }

    renderFilterNoSelector() {
        return (<View style={styles.modalView}>
            {this.props.fields.map((field, index) => {
                return (
                    <TouchableHighlight
                        style={styles.modalFilterNameButton}
                        key={index}
                        underlayColor={Colors.KURABUPINK}
                        onPress={() => {
                            // console.log("clicked", field.name)
                            this.setState({ filtering: true, filterIndex: index });
                        }}
                    >
                        <View style={styles.modalFilterNameButtonContentContainer}>
                            <Text style={styles.modalFilterNameButtonText}>{field.name}</Text>
                            <Icon color={Colors.TEXT} name="arrow-right" tvParallaxProperties={undefined} />
                        </View>
                    </TouchableHighlight>);
            })}
        </View>);
    }

    renderFilterWithSelector() {
        if (this.state.filterIndex === false) return;

        const filterIndex = this.state.filterIndex;
        const theField = this.props.fields[filterIndex];
        const currentFields = this.props.currentFields;

        const possibleValues = theField.possibleValues.filter((value) => {
            return isValidField({
                name: theField.name,
                value: value.val,
                negative: false,
            }, this.props.fields, currentFields)[0] ||
                isValidField({
                    name: theField.name,
                    value: value.val,
                    negative: true,
                }, this.props.fields, currentFields)[0];
        });

        return (<View style={styles.modalView}>
            {
                possibleValues.map((fieldValue, index) => {
                    const positiveField = isValidField({
                        name: theField.name,
                        value: fieldValue.val,
                        negative: false,
                    }, this.props.fields, currentFields)

                    const negativeField = isValidField({
                        name: theField.name,
                        value: fieldValue.val,
                        negative: true,
                    }, this.props.fields, currentFields)

                    return (
                        <View key={index} style={styles.modalFilterNameButtonContentContainer}>
                            <Text style={styles.modalFilterNameButtonText}>{fieldValue.val}</Text>
                            {
                                positiveField[0] === false ?
                                    undefined : <TouchableHighlight
                                        style={styles.modalFilterButtonAddSubtract}
                                        underlayColor={Colors.KURABUPINK}
                                        onPress={() => {
                                            if (this.state.filterIndex === false) return;

                                            if (positiveField[0] === false || positiveField[1] === undefined) {
                                                Alert.alert("Invalid field", "This field is not valid");
                                                return;
                                            }

                                            this.props.onChange([...this.props.currentFields, positiveField[1]], this.props.search, true);
                                            this.setState({ filtering: false, filterIndex: false });
                                        }}>
                                        <Icon color={Colors.TEXT} name="add" tvParallaxProperties={undefined} />
                                    </TouchableHighlight>
                            }

                            <View style={styles.smallSpacing}></View>

                            {negativeField[0] === false ?
                                undefined : <TouchableHighlight
                                    style={styles.modalFilterButtonAddSubtract}
                                    underlayColor={Colors.KURABUPINK}
                                    onPress={() => {
                                        if (this.state.filterIndex === false) return;

                                        if (negativeField[0] === false || negativeField[1] === undefined) {
                                            Alert.alert("Invalid field", "This field is not valid");
                                            return;
                                        }

                                        this.props.onChange([...this.props.currentFields, negativeField[1]], this.props.search, true);
                                        this.setState({ filtering: false, filterIndex: false });
                                    }}>
                                    <Icon color={Colors.TEXT} name="remove" tvParallaxProperties={undefined} />
                                </TouchableHighlight>
                            }
                        </View>
                    );
                })}
        </View>);
    }

    render() {
        return (
            <View>
                <Modal
                    visible={this.state.filtering}
                    transparent={true}
                >
                    <View style={styles.modalCloseButtonContainer}>
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => {
                                this.setState({ filtering: false, filterIndex: false });
                            }}>
                            <Icon color={Colors.TEXT} name="close" tvParallaxProperties={undefined} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalBackgroundView}>
                        {this.state.filterIndex === false ? this.renderFilterNoSelector() : this.renderFilterWithSelector()}
                    </View>
                </Modal>
                <View style={styles.searchContainer}>
                    <View style={styles.searchParent}>
                        <SearchBar
                            value={this.props.search}
                            platform={"default"}
                            onBlur={() => { return; }}
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                            onChangeText={((text?: string) => {
                                this.changeText(text ?? "");
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            })}
                            onFocus={() => { return; }}
                            clearIcon={{
                                ...createClearIcon(undefined, this.props.styles.clearIconStyle),
                                name: "close"
                            }}
                            searchIcon={{
                                ...createSearchIcon(undefined, this.props.styles.searchIconStyle),
                                name: "search"
                            }}
                            loadingProps={{}}
                            showLoading={false}
                            onClear={() => { this.props.onChange([], "", false) }}
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
                    </View>
                    <View>
                        <TouchableOpacity
                            style={styles.filterAddButton}
                            onPress={() => {
                                this.setState({
                                    filtering: true,
                                    filterIndex: false
                                })
                            }}>
                            <Icon
                                type="material-community"
                                name="filter-variant-plus"
                                tvParallaxProperties={undefined}
                                size={fontSize * 2}
                                color={Colors.TEXT} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.fieldsContainer}>
                    {
                        this.props.currentFields.map((field, index) => {
                            return (
                                <View key={index} style={{
                                    ...styles.field,
                                    borderColor: field.color,
                                    backgroundColor: field.color
                                }}>
                                    <Text style={styles.fieldText}>{field.negative ? "-" : "+"}{field.name}: {field.value}</Text>
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
        );
    }
}

const fontSize = Dimensions.get("window").width / 36;

const styles = StyleSheet.create({
    modalFilterButtonAddSubtract: {
        padding: 5,
        borderRadius: 10
    },
    smallSpacing: {
        width: 10
    },
    fieldsContainer: {
        flexDirection: "row",
        width: Dimensions.get("window").width - 10 - fontSize * 3,
        flexWrap: "wrap",
        // backgroundColor: Colors.TEXT,
    },
    field: {
        padding: 5,
        borderRadius: 5,

        width: "auto",
        alignSelf: "flex-start",
        alignContent: "center",
        flexDirection: "row",
        margin: 5
    },
    fieldText: {
        alignSelf: "flex-start",
        fontSize: fontSize * 1.1
    },
    filterAddButton: {
        backgroundColor: Colors.KURABUPURPLE,
        height: "auto",
        justifyContent: 'center',
        borderRadius: 100,
        alignSelf: "stretch",
        aspectRatio: 1,
        margin: 10,
        marginLeft: 0,
        flex: 1,
    },
    searchContainer: {
        display: "flex",
        flexDirection: "row",
        width: Dimensions.get("window").width,
    },
    modalBackgroundView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.TRANSPARENT_BACKGROUND
    },
    modalView: {
        width: Dimensions.get("window").width / 1.5,
        // minHeight: Dimensions.get("window").width / 1.3,
    },
    searchParent: {
        flex: 1,
    },
    modalFilterNameButton: {
        // width: "100%",

    },
    modalFilterNameButtonContentContainer: {
        flexDirection: "row",
        padding: 20,
        backgroundColor: Colors.KURABUPURPLE,
    },
    modalFilterNameButtonText: {
        color: Colors.TEXT,
        fontSize: fontSize * 1.3,
        flex: 1
    },
    modalCloseButtonContainer: {
        backgroundColor: Colors.TRANSPARENT_BACKGROUND,
        alignItems: "flex-end",
        // padding: 20
    },
    modalCloseButton: {
        backgroundColor: Colors.KURABUPINK,
        borderRadius: 100,
        padding: 5,
        margin: 10
    }
});

function isValidField(field: Omit<FieldValue, "color">, allowedFields: Field[], currentFields: FieldValue[]): [boolean, FieldValue | undefined] {
    for (const f of currentFields) {
        if (f.name === field.name) {
            if ((f.negative ?? false) !== (field.negative ?? false)) {
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

                fields.push(validField[1]);
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