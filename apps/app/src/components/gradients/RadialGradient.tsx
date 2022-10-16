import React from "react";
import { StyleSheet, ViewProps } from "react-native";
import Svg, { Defs, RadialGradient as SVGRadialGradient, Rect, Stop } from "react-native-svg";

export type RadialGradientProps = {
	x: number | `${number}%`,
	y: number | `${number}%`,
	rx: number | `${number}%`,
	ry: number | `${number}%`
	stops: RadialGradientStopProp[];
}

export type RadialGradientStopProp = {
	offsetPercentage: number | `${number}%`;
	color: string;
}


export class RadialGradient extends React.Component<RadialGradientProps & ViewProps> {
	render() {
		const flattenedStyles = StyleSheet.flatten(this.props.style)

		return (<Svg {...this.props} height={flattenedStyles?.height} width={flattenedStyles?.width}>
			<Defs>
				<SVGRadialGradient
					id="grad"
					cx={this.props.x}
					cy={this.props.y}
					rx={this.props.rx}
					ry={this.props.ry}
					gradientUnits="userSpaceOnUse"
				>
					{this.props.stops.map((stop, index) => (
						<Stop key={`RadialGradient_${index}`} offset={stop.offsetPercentage} stopColor={stop.color} />
					))}
				</SVGRadialGradient>
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
