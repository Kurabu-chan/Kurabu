import { createClearIcon, createSearchIcon } from "#helpers/DefaultIcons";
import { ThemedStyleSheet } from "#helpers/ThemedStyleSheet";
import { AppliedStyles, colors, ProvidedTheme, ThemedComponent } from "@kurabu/theme";
import React from "react";
import { createTypographyStyles } from "./Typography";
import { SearchBar } from "react-native-elements";

type Props = {
	title: string,
	search: string,
	changeText: (text: string) => void,
	clearSearch: () => void,
	runSearch: () => void
}

export class ThemedSearchBar extends ThemedComponent<Styles, Props>{ 
	constructor(props: Props) { 
		super(styles, props);
	}

	renderThemed(styles: AppliedStyles<Styles>, providedTheme: ProvidedTheme) { 
		const appliedTextStyle = inputTextStyle[1]({
			text: styles.inputText
		}, providedTheme, {});

		return (
			<SearchBar
				placeholder={ this.props.title}
				value={this.props.search}
				platform={"default"}
				autoCompleteType={undefined}
				onBlur={() => { return; }}
				onChangeText={((text?: string) => {
					this.props.changeText(text ?? "");
				})}
				onFocus={() => { return; }}
				clearIcon={{
					...createClearIcon(undefined, {}, styles.clearIconStyle[1].color),
					name: "close"
				}}
				searchIcon={{
					...createSearchIcon(undefined, {}, styles.searchIconStyle[1].color),
					name: "search"
				}}
				loadingProps={{}}
				showLoading={false}
				onClear={() => { this.props.clearSearch() }}
				onCancel={() => { console.log("onCancel") }}
				lightTheme={false}
				round={true}
				cancelButtonTitle={""}
				cancelButtonProps={{}}

				onEndEditing={() => { this.props.runSearch() }}
				showCancel={true}
				disabledInputStyle={appliedTextStyle}
				style={styles.searchBarStyle}
				inputStyle={appliedTextStyle}
				inputContainerStyle={styles.inputContainerStyle}
				containerStyle={styles.containerStyle}
				leftIconContainerStyle={styles.leftIconContaienrStyle}
			/>
		);
	}
}

const inputTextStyle = createTypographyStyles("headline4", "paragraph", false, "secondary");

type Styles = typeof styles;
const styles = ThemedStyleSheet.create({
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
