import { Colors } from "#config/Colors";
import { createClearIcon } from "#helpers/DefaultIcons";
import { ThemedStyleSheet } from "#helpers/ThemedStyleSheet";
import { AppliedStyles, applyUnfrozen, colors, ProvidedTheme, sizing, ThemedComponent } from "@kurabu/theme";
import React from "react";
import { View, Dimensions, ColorValue, Modal, TouchableOpacity, TouchableHighlight, Alert } from "react-native";
import { Icon } from "react-native-elements";
import { ThemedSearchBar } from "./themed/SearchBar";
import { createTypographyStyles, Typography } from "./themed/Typography";

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
	mediaType: "anime"|"manga"
}

type State = {
	filtering: boolean,
	filterIndex: number | false,
}

export class FieldSearchBar extends ThemedComponent<Styles, Props, State> {
	private timeout: NodeJS.Timeout | undefined;

	constructor(props: Props) {
		super(styles, props);
		this.state = {
			filtering: false,
			filterIndex: false
		}
	}

	changeText(search: string) {
		if (this.timeout) clearTimeout(this.timeout);

		this.timeout = setTimeout(() => {
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
	}

	removeField(field: FieldValue) {
		const fields = this.props.currentFields;
		const index = fields.findIndex(f => f.name === field.name && f.value === field.value);
		if (index === -1) return;
		fields.splice(index, 1);
		this.props.onChange(fields, this.props.search, true);
	}

	renderFilterNoSelector(styles: AppliedStyles<Styles>, providedTheme: ProvidedTheme) {
		const secondStyles = applyUnfrozen({
			colors: {
				primary: colors.color("primary"),
				onSecondary: colors.onColor("secondary", "paragraph"),
			}
		}, providedTheme)

		return (<View style={styles.modalView}>
			{this.props.fields.map((field, index) => {
				return (
					<TouchableHighlight
						key={index}
						underlayColor={secondStyles.colors.primary}
						onPress={() => {
							// console.log("clicked", field.name)
							this.setState({ filtering: true, filterIndex: index });
						}}
					>
						<View style={styles.modalFilterNameButtonContentContainer}>
							<Typography style={styles.modalFilterNameButtonText} colorVariant="primary" isOnContainer={false} textKind="paragraph" variant="body1">{field.name}</Typography>
							<Icon color={secondStyles.colors.onSecondary} name="arrow-right" tvParallaxProperties={undefined} />
						</View>
					</TouchableHighlight>);
			})}
		</View>);
	}

	renderFilterWithSelector(styles: AppliedStyles<Styles>, providedTheme: ProvidedTheme) {
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

		const secondStyles = applyUnfrozen({
			colors: {
				primary: colors.color("primary"),
				onSecondary: colors.onColor("secondary", "paragraph"),
			}
		}, providedTheme)

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
							<Typography style={styles.modalFilterNameButtonText} colorVariant="primary" isOnContainer={false} textKind="paragraph" variant="body1">{fieldValue.val}</Typography>
							{
								positiveField[0] === false ?
									undefined : <TouchableHighlight
										style={styles.modalFilterButtonAddSubtract}
										underlayColor={secondStyles.colors.primary}
										onPress={() => {
											if (this.state.filterIndex === false) return;

											if (positiveField[0] === false || positiveField[1] === undefined) {
												Alert.alert("Invalid field", "This field is not valid");
												return;
											}

											this.props.onChange([...this.props.currentFields, positiveField[1]], this.props.search, true);
											this.setState({ filtering: false, filterIndex: false });
										}}>
										<Icon color={secondStyles.colors.onSecondary} name="add" tvParallaxProperties={undefined} />
									</TouchableHighlight>
							}

							<View style={styles.smallSpacing}></View>

							{negativeField[0] === false ?
								undefined : <TouchableHighlight
									style={styles.modalFilterButtonAddSubtract}
									underlayColor={secondStyles.colors.primary}
									onPress={() => {
										if (this.state.filterIndex === false) return;

										if (negativeField[0] === false || negativeField[1] === undefined) {
											Alert.alert("Invalid field", "This field is not valid");
											return;
										}

										this.props.onChange([...this.props.currentFields, negativeField[1]], this.props.search, true);
										this.setState({ filtering: false, filterIndex: false });
									}}>
									<Icon color={secondStyles.colors.onSecondary} name="remove" tvParallaxProperties={undefined} />
								</TouchableHighlight>
							}
						</View>
					);
				})}
		</View>);
	}

	renderThemed(styles: AppliedStyles<Styles>, providedTheme: ProvidedTheme) {

		const secondStyles = applyUnfrozen({
			colors: {
				icon: colors.onColor("secondary", "paragraph"),
				onLabels: colors.onLabels("paragraph"), providedTheme
			}
		}, providedTheme)

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
							<Icon color={secondStyles.colors.icon} name="close" tvParallaxProperties={undefined} />
						</TouchableOpacity>
					</View>
					<View style={styles.modalBackgroundView}>
						{this.state.filterIndex === false ? this.renderFilterNoSelector(styles, providedTheme) : this.renderFilterWithSelector(styles, providedTheme)}
					</View>
				</Modal>
				<View style={styles.searchContainer}>
					<View style={styles.searchParent}>
						<ThemedSearchBar
							title={this.props.mediaType == "anime" ? "Search for an anime title": "Search for a manga title"}
							search={this.props.search}
							changeText={((text?: string) => {
								this.changeText(text ?? "");
							})}
							clearSearch={() => { this.props.onChange([], "", false) }}
							runSearch={() => { this.props.onSearch() }}
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
								color={secondStyles.colors.icon} />
						</TouchableOpacity>
					</View>
				</View>

				<View style={styles.fieldsContainer}>
					{
						this.props.currentFields.map((field, index) => {
							return (
								<View key={index} style={[
									...styles.field,
									{
										borderColor: field.color,
										backgroundColor: field.color
									}
								]}>
									<Typography colorVariant="labels" isOnContainer={false} textKind="paragraph" variant="body1">{field.negative ? "-" : "+"}{field.name}: {field.value}</Typography>
									<TouchableOpacity
										onPress={() => {
											this.removeField(field);
										}}>
										{createClearIcon(fontSize * 1.6, {}, secondStyles.colors.onLabels)}
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

const inputTextStyle = createTypographyStyles("headline4", "paragraph", false, "secondary");

type Styles = typeof styles;
const styles = ThemedStyleSheet.create({
	modalFilterButtonAddSubtract: {
		padding: sizing.spacing("halfMedium"),
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
		borderRadius: sizing.rounding("large") as number 
	},
	smallSpacing: {
		width: sizing.spacing("medium")
	},
	fieldsContainer: {
		flexDirection: "row",
		width: sizing.vw(92, -10),
		flexWrap: "wrap",
	},
	field: {
		padding: sizing.spacing("halfMedium"),
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
		borderRadius: sizing.rounding("small") as number,

		width: "auto",
		alignSelf: "flex-start",
		alignContent: "center",
		flexDirection: "row",
		margin: sizing.spacing("halfMedium")
	},
	fieldText: {
		alignSelf: "flex-start",
		fontSize: fontSize * 1.1,
		color: colors.onLabels("paragraph")
	},
	filterAddButton: {
		backgroundColor: colors.color("secondary"),
		height: "auto",
		justifyContent: 'center',
		borderRadius: 100,
		alignSelf: "stretch",
		aspectRatio: 1,
		margin: sizing.spacing("medium"),
		marginLeft: 0,
		flex: 1,
	},
	searchContainer: {
		display: "flex",
		flexDirection: "row",
		width: sizing.vw(100),
	},
	modalBackgroundView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: Colors.TRANSPARENT_BACKGROUND
	},
	modalView: {
		width: sizing.vw(66),
	},
	searchParent: {
		flex: 1,
	},
	modalFilterNameButtonContentContainer: {
		flexDirection: "row",
		padding: sizing.spacing("large"),
		backgroundColor: colors.color("secondary"),
	},
	modalFilterNameButtonText: {
		flex: 1
	},
	modalCloseButtonContainer: {
		backgroundColor: Colors.TRANSPARENT_BACKGROUND,
		alignItems: "flex-end",
		// padding: 20
	},
	modalCloseButton: {
		backgroundColor: colors.color("secondary"),
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
		borderRadius: sizing.rounding("full") as number,
		padding: sizing.spacing("halfMedium"),
		margin: sizing.spacing("medium")
	},
	// eslint-disable-next-line react-native/no-color-literals
	containerStyle: {
		backgroundColor: "transparent",
		borderTopWidth: 0,
		borderBottomWidth: 0,
	},
	leftIconContaienrStyle: {
		backgroundColor: colors.color("secondary"),
	},
	inputContainerStyle: {
		backgroundColor: colors.color("secondary"),
	},
	searchBarStyle: {
		backgroundColor: colors.color("secondary"),
		color: colors.onColor("secondary", "paragraph"),
	},
	clearIconStyle: {
		color: colors.onColor("secondary", "paragraph")
	},
	searchIconStyle: {
		color: colors.onColor("secondary", "paragraph"),
	},
	inputText: {
		...inputTextStyle[0].text
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
