import { Colors } from "#config/Colors";
import { DetailsStackParamList } from "#routes/MainStacks/DetailsStack";
import { RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Dimensions, SafeAreaView, StyleSheet, Image } from "react-native";
import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView';
import { MainGradientBackground } from "#comps/MainGradientBackground";

type Props = {
    navigation: StackNavigationProp<DetailsStackParamList, "DetailsImageScreen">;
    route: RouteProp<DetailsStackParamList, "DetailsImageScreen">;
}

type State = {
    resetKey: number
}


export class DetailsImage extends React.Component<Props, State> {
    zoomableView?: ReactNativeZoomableView;

    constructor(props: Props) {
        super(props);
        this.state = {
            resetKey: 0
        }
    }

    componentDidMount() {
        // This is necessary to make sure the actual scaling is fixed after popToTop
        if (this.zoomableView) {
            this.zoomableView?.setState({
                originalWidth: Dimensions.get("window").width,
                originalHeight: Dimensions.get("window").height,
                originalPageX: 0,
                originalPageY: 0,
            });
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.appContainer}>
				<MainGradientBackground>

                    <ReactNativeZoomableView
                        key={new Date().getTime()}
                        maxZoom={10}
                        minZoom={0.5}
                        zoomStep={0.5}
                        initialZoom={0.9}
                        initialOffsetX={0}
                        ref={(ref: ReactNativeZoomableView) => {
                            this.zoomableView = ref;
                        }}
                        bindToBorders={true}
                        contentHeight={(Dimensions.get("window").width - 20) * 1.5}
                        contentWidth={(Dimensions.get("window").width - 20 + this.state.resetKey)}>
                        <Image
                            source={{
                                uri: this.props.route.params.picture.large ?? this.props.route.params.picture.medium
                            }}
                            style={styles.image} />
                    </ReactNativeZoomableView>


                </MainGradientBackground>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    appContainer: {
        backgroundColor: Colors.INVISIBLE_BACKGROUND,
        flex: 1
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    }
});
