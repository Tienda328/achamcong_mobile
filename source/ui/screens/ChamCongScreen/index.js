/* eslint-disable no-console */
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Slider,
    TouchableWithoutFeedback,
    Dimensions,
    BackHandler,
    Alert
} from 'react-native';
// eslint-disable-next-line import/no-unresolved
import { RNCamera } from 'react-native-camera';
import { connect } from 'react-redux';
import { api } from '../../../commons/api/Api';
import { commonsConfigs as configs } from '../../../commons'
import { actions } from '../../../commons/action';
import { IconView } from '../../components';
import DeviceInfo from 'react-native-device-info';
import Popup from '../../components/Dialog';

const landmarkSize = 2;

class CameraScreen extends React.Component {
    state = {
        autoFocus: 'on',
        autoFocusPoint: {
            normalized: { x: 0.5, y: 0.5 }, // normalized values required for autoFocusPointOfInterest
            drawRectPosition: {
                x: Dimensions.get('window').width * 0.5 - 32,
                y: Dimensions.get('window').height * 0.5 - 32,
            },
        },
        recordOptions: {
            mute: false,
            maxDuration: 5,
            quality: RNCamera.Constants.VideoQuality['288p'],
        },
        canDetectFaces: true,
        faces: [],
    };

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backPressed);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    }

    backPressed = () => {
        this.props.navigation.goBack();
        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.ChamCongReducer) {
            if (this.props.ChamCongReducer.isChamCong && this.props.ChamCongReducer.isChamCong !== '') {
                Popup.show({
                    type: 'Warning',
                    title: configs.APP_NAME,
                    textBody:
                        this.props.ChamCongReducer.isChamCong,
                    button: true,
                    buttonCancel: false,
                    callback: () => {
                        this.props.requestDataChamCong()
                        this.backPressed()
                        this.props.navigation.state.params.responsesResetData()
                        Popup.hide()
                    },
                    callbackOk: () => Popup.hide(),
                });

                // setTimeout(() => {
                //     Alert.alert(
                //         configs.NAME_APP,
                //         this.props.ChamCongReducer.isChamCong,
                //         [
                //             {
                //                 text: configs.DONG_Y, onPress: () => {
                //                     this.props.requestDataChamCong()
                //                     this.backPressed()
                //                     this.props.navigation.state.params.responsesResetData()
                //                 }
                //             }
                //         ],
                //     );
                // }, 700);

            }
        }
    }

    takePicture = async () => {
        if (this.camera) {
            let options = {
                quality: 0.5, base64: true, height: 700, forceUpOrientation: true,
                fixOrientation: true, mirrorImage: true, doNotSave: false
            };
            await this.camera.takePictureAsync(options) // options)
                .then(data => {
                    // let dataFrom = new FormData()
                    // dataFrom.append("image")
                    let params = {
                        image: "data:image/jpg;base64," + data.base64,
                        device: DeviceInfo.getModel()
                    }
                    this.setState({
                        canDetectFaces: false
                    })
                    this.props.requestChamCong(params)
                })
                .catch(error => {
                    console.log('eror', error)
                    alert(error)
                });
        }
    };

    toggle = value => () => this.setState(prevState => ({ [value]: !prevState[value] }));

    facesDetected = ({ faces }) => {
        this.setState({ faces })
        // if (faces.length !== 0) {
        //     console.log("faces:   ", faces)
        //     this.setState({
        //         canDetectFaces: false
        //     })
        //     console.log("vao day")
        //     // this.takePicture()
        // }
    };

    renderFace = ({ bounds, faceID, rollAngle, yawAngle }) => {
        if (rollAngle > -2 && rollAngle < 2 && yawAngle > -4 && yawAngle < 4) {
            this.takePicture()

            console.log("vao day")
        }
        return (
            <View
                key={faceID}
                transform={[
                    { perspective: 600 },
                    { rotateZ: `${rollAngle.toFixed(0)}deg` },
                    { rotateY: `${yawAngle.toFixed(0)}deg` },
                ]}
                style={[
                    styles.face,
                    {
                        ...bounds.size,
                        left: bounds.origin.x,
                        top: bounds.origin.y,
                        backgroundColor: 'transparent'
                    },
                ]}
            >
                {/* <Text style={styles.faceText}>ID: {faceID}</Text>
                <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
                <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text> */}
                {/* <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
                <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text> */}
                <Text style={styles.faceText}>{'Đang nhận diện khuôn mặt'}</Text>
            </View>
        );
    }

    renderFaces = () => (
        <View style={styles.facesContainer} pointerEvents="none">
            {this.state.faces.map(this.renderFace)}
        </View>
    );

    render() {
        const { canDetectFaces } = this.state;
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.container}
                    type={RNCamera.Constants.Type.front}
                    // flashMode={this.state.flash}
                    // autoFocus={this.state.autoFocus}
                    autoFocusPointOfInterest={this.state.autoFocusPoint.normalized}
                    // zoom={this.state.zoom}
                    ratio="16:9"
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
                    faceDetectionLandmarks={
                        RNCamera.Constants.FaceDetection.Landmarks
                            ? RNCamera.Constants.FaceDetection.Landmarks.all
                            : undefined
                    }
                    onFacesDetected={canDetectFaces ? this.facesDetected : null}
                >
                    {/* <View style={StyleSheet.absoluteFill}>
                    <View style={[styles.autoFocusBox, drawFocusRingPosition]} />
                    <TouchableWithoutFeedback onPress={this.touchToFocus.bind(this)}>
                        <View style={{ flex: 1 }} />
                    </TouchableWithoutFeedback>
                </View> */}
                    <View
                        style={{
                            backgroundColor: 'transparent',
                            justifyContent: 'flex-end',
                            height: '100%'
                        }}
                    >
                        <View style={{ position: 'absolute', top: 40, left: 25, }}>
                            <IconView
                                onPress={() => {
                                    this.backPressed()
                                    this.props.navigation.state.params.responsesResetData()
                                }}
                                style={{ justifyContent: 'center', alignItems: 'center' }}
                                color='white'
                                name={"left-arrow"}
                                size={24}
                                height={20}
                            />
                        </View>

                        <TouchableOpacity style={[styles.flipButton, {
                            backgroundColor: 'white',
                            opacity: 0.5,
                        }]}>
                            <Text style={[styles.flipText, { color: canDetectFaces ? "red" : 'blue', textAlign: 'center', fontWeight: 'bold' }]}>
                                {!canDetectFaces ? 'Đã nhận diện được khuôn mặt' : 'Chưa nhận diện được khuôn mặt, Vui lòng thử lại.'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {!!canDetectFaces && this.renderFaces()}
                    {/* {!!canDetectFaces && this.renderLandmarks()} */}
                </RNCamera>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        flex: 1,
        // margin: 50,
        width: '100%'
    },
    flipButton: {
        marginHorizontal: 20,
        marginBottom: 40,
        borderRadius: 8,
        borderColor: 'white',
        borderWidth: 1,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',

    },
    autoFocusBox: {
        position: 'absolute',
        height: 64,
        width: 64,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'white',
        opacity: 0.4,
    },
    flipText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'Lato-Regular',
    },
    zoomText: {
        position: 'absolute',
        bottom: 70,
        zIndex: 2,
        left: 2,
    },
    picButton: {
        backgroundColor: 'darkseagreen',
    },
    facesContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
    },
    face: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 2,
        position: 'absolute',
        borderColor: '#FFD700',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    landmark: {
        width: landmarkSize,
        height: landmarkSize,
        position: 'absolute',
        backgroundColor: 'red',
    },
    faceText: {
        color: '#FFD700',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        backgroundColor: 'transparent',
    },
    text: {
        padding: 10,
        borderWidth: 2,
        borderRadius: 2,
        position: 'absolute',
        borderColor: '#F00',
        justifyContent: 'center',
    },
    textBlock: {
        color: '#F00',
        position: 'absolute',
        textAlign: 'center',
        backgroundColor: 'transparent',
    },
    camera: {
        height: 250,
        width: 250,
        marginTop: 10,
    },

});

const mapStateToProps = state => ({
    ChamCongReducer: state.ChamCongReducer
});

const mapDispatchToProps = (dispatch) => {
    return {
        requestChamCong: (params) => {
            api.requestChamCong(dispatch, params)
        },
        requestDataChamCong: () => {
            dispatch(actions.requestDataChamCong(''))
        },
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(CameraScreen)