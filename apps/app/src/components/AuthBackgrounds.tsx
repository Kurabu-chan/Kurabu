import { StyleSheet, View, Dimensions } from "react-native";
import Kurabu from "../../assets/Kurabu.svg";
import { RadialGradient, RadialGradientStopProp } from "./gradients/RadialGradient";
import { applyUnfrozen, colors, useThemeProvider } from "@kurabu/theme";

const aspectRatio = 6480 / 16143
type NewProps = {
	inverted: boolean
}

export function AuthBackground({ inverted }: NewProps) {
	const providedTheme = useThemeProvider();

	let gradient = Object.values(applyUnfrozen({
		gradient: {
			fourth: colors.gradientStart("background"),
			third: colors.gradientSecond("background"),
			second: colors.gradientSecond("primary"),
			first: colors.gradientStart("primary"),
		}
	}, providedTheme).gradient);


	if (inverted === true) {
		gradient = gradient.reverse();
	}

	const offset = 0.6;

	const gradientPosition : `${number}%` = `${Math.round((1+offset)*100)}%`;
	const r = Dimensions.get("screen").height * (1 + offset);

	const stops = gradient.map((col, i) => {
		return {
			offsetPercentage: String(Math.round(Math.pow((i / (gradient.length-1)), 0.8) * 100)) + "%",
			color: col,
		} as RadialGradientStopProp
	})
	

	const screenRatio = Dimensions.get("screen").width / Dimensions.get("screen").height;
	const kurabuOffset = `${calculateKurabuOffset()}%`;
	/*
		we want ~-30% for 1080x2160 (1:2) 0.5
		we want ~-15% for 2200x2480 (~1:1) 0.8
		we want ~0% for 1920x1080 (~1.5:1) 1.7
		we want ~15% for 2160x1080 (~2:1) 2

		the values were optimized using an algorithm which is now long gone
	*/
	function calculateKurabuOffset() {
		return -(((1) / (((Math.pow(screenRatio, 0.048)) / (665)))) - 658)-3
	}

	return (<View style={styles.container}>
		<RadialGradient
			stops={stops}
			x="50%" y={gradientPosition} rx={r} ry={r}
			style={StyleSheet.flatten([{
				height: Dimensions.get("screen").height,
				width: Dimensions.get("screen").width,
			}, styles.gradient])} 

		/>
		<View style={StyleSheet.flatten([{
			aspectRatio: aspectRatio,
			height: Dimensions.get("window").height * 1.2,
			// position: "absolute",
			right: kurabuOffset
		}, styles.imgContainer])}>
			<Kurabu
				width="100%"
				height="100%"
				viewBox="0 0 6480 16143"
				preserveAspectRatio="xMinYMin slice"
			/>
		</View>
	</View>);
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		alignItems: "flex-end",
		width: "100%",
	},
	gradient: {
		position: "absolute",
	},
	imgContainer: {
		bottom: "-5%"
	}
});
