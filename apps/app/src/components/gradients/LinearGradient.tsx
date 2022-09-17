import React from "react";
import { StyleSheet, ViewProps } from "react-native";
import Svg, { Defs, LinearGradient as SVGLinearGradient, Rect, Stop } from "react-native-svg";

export type LienarGradientProps = {
	x1: number,
	x2: number,
	y1: number,
	y2: number,
	stops: LinearGradientStopProp[];
}

export type LinearGradientStopProp = {
	offsetPercentage: number | `${number}%`;
	color: string;
}


export class LinearGradient extends React.Component<LienarGradientProps & ViewProps> {
	render() {
		const flattenedStyles = StyleSheet.flatten(this.props.style)

		return (<Svg {...this.props} height={flattenedStyles?.height} width={flattenedStyles?.width}>
			<Defs>
				<SVGLinearGradient
					id="grad"
					x1={`${this.props.x1}%`}
					y1={`${this.props.y1}%`}
					x2={`${this.props.x2}%`}
					y2={`${this.props.y2}%`}
					gradientUnits="userSpaceOnUse"
				>
					{this.props.stops.map((stop, index) => (
						<Stop key={`LinearGradient_${index}`}
							offset={stop.offsetPercentage}
							stopColor={stop.color} />
					))}
				</SVGLinearGradient>
			</Defs>
			<Rect
				x="0"
				y="0"
				width="100%"
				height="100%"
				fill="url(#grad)"
			/>
		</Svg>);
	}
}
