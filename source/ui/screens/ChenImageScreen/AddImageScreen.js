/* eslint-disable no-console */
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
    BackHandler,
    Alert,
    UIManager
} from 'react-native';
// eslint-disable-next-line import/no-unresolved
import { RNCamera } from 'react-native-camera';
import { connect } from 'react-redux';
import { api } from '../../../commons/api/Api';
import { commonsConfigs as configs } from '../../../commons'
import { actions } from '../../../commons/action';
import { BaseDiaLogAlert, IconView } from '../../components';
import DeviceInfo from 'react-native-device-info';
import { Svg, Defs, Rect, Mask, Circle } from 'react-native-svg';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const landmarkSize = 2;
const { width, height } = Dimensions.get('window')
const heightView = width - 100


class CameraScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
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
            dataFace: [],
            earPosX: null,
            earPosY: null,
            erorrText: "",
            percentage: 0,
            dataError: []
        };
        this.isTienTrinhChupAnh = true
        this.deviceInfo = ''
        this.dataCoordinates = this.props.navigation.state.params.dataCoordinates || {}
        // this.dataCoordinates = this.props.navigation.state.params.responsesResetData || null
    }


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

    // componentDidUpdate(prevProps, prevState) {
    //     if (this.props.ChamCongReducer) {
    //         if (this.props.ChamCongReducer.isChamCong && this.props.ChamCongReducer.isChamCong !== '') {
    //             setTimeout(() => {
    //                 Alert.alert(
    //                     configs.NAME_APP,
    //                     this.props.ChamCongReducer.isChamCong,
    //                     [
    //                         {
    //                             text: configs.DONG_Y, onPress: () => {
    //                                 this.backPressed()
    //                                 this.props.navigation.state.params.responsesResetData()
    //                                 this.props.requestDataChamCong()
    //                             }
    //                         }
    //                     ],
    //                 );
    //             }, 700);

    //         }
    //     }
    // }

    takePicture = async () => {
        if (this.camera) {
            let options = {
                quality: 0.5, base64: true, height: 700, forceUpOrientation: true,
                fixOrientation: true, mirrorImage: true, doNotSave: false,
                pauseAfterCapture: true,
            };
            await this.camera.takePictureAsync(options) // options)
                .then(data => {
                    this.setState({
                        canDetectFaces: false
                    })
                    if (this.props.navigation.state.params.responsesResetData) {
                        this.backPressed()
                        this.props.navigation.state.params.responsesResetData("data:image/jpg;base64," + data.base64)
                    }
                    console.log("dã chụp thành công")
                })
                .catch(error => console.log('eror', error));
        }
    };

    toggle = value => () => this.setState(prevState => ({ [value]: !prevState[value] }));

    facesDetected = ({ faces }) => {
        if (this.isTienTrinhChupAnh) {
            var title1 = ''
            var trangThai1 = ''
            var title2 = ''
            var trangThai2 = ''
            var title3 = ''
            var trangThai3 = ''
            var title4 = ''
            var trangThai4 = ''


            var percentage = 0
            if (faces.length === 1) {
                title4 = "Có 1 khuôn mặt trong khung hình"
                trangThai4 = true
                percentage = percentage + 25

                if (faces[0]) {
                    if (faces[0].bounds && faces[0].bounds.origin && faces[0].bounds.origin.x > this.xLeftTop && faces[0].bounds.origin.y > this.yLeftTop
                        && this.xLeftTop + width > faces[0].bounds.origin.x + faces[0].bounds.size.width
                        && this.yLeftTop + width > faces[0].bounds.origin.y + faces[0].bounds.size.height) {
                        title1 = "Đã nhận diện khuôn mặt"
                        trangThai1 = true
                        percentage = percentage + 25
                    } else {
                        title1 = "Khuôn mặt đang không được để ở vị trí chính xác."
                        trangThai1 = false
                    }

                    let rightEye = faces[0].rightEyeOpenProbability;
                    let leftEye = faces[0].leftEyeOpenProbability;
                    let blinkProb = (rightEye + leftEye) / 2;

                    if (blinkProb >= 0.8) {
                        title2 = "Đã nhận diện được đôi mắt"
                        trangThai2 = true
                        percentage = percentage + 25
                    } else if (blinkProb <= 0.3) {
                        title2 = "Mắt đang đóng"
                        trangThai2 = false
                    }

                    console.log("faces[0].rollAngle:    ", faces[0].rollAngle + '    ' + faces[0].yawAngle)
                    if (faces[0].rollAngle > -4 && faces[0].rollAngle < 4 && faces[0].yawAngle > -6 && faces[0].yawAngle < 6) {
                        title3 = "Khuôn mặt đã đúng vị trí."
                        trangThai3 = true
                        percentage = percentage + 25
                    } else {
                        title3 = "Khuôn mặt đang để nghiêng hoặc có vật che khuôn mặt"
                        trangThai3 = false
                    }

                } else {
                    title1 = "Chưa có khuôn mặt trong khung hình."
                    trangThai1 = false
                }
            } else {
                title4 = "Có nhiều hơn 1 khuôn mặt trong khung hình"
                trangThai4 = false
            }


            let dataError = [
                {
                    title: title1,
                    trangThai: trangThai1
                },
                {
                    title: title2,
                    trangThai: trangThai2
                },
                {
                    title: title3,
                    trangThai: trangThai3
                },
                {
                    title: title4,
                    trangThai: trangThai4
                },
            ]
            this.setState({ dataError, percentage, faces })
            if (percentage === 100) {
                this.isTienTrinhChupAnh = false
                this.takePicture()
            }
        }
    };

    WrappedSvg() {
        return (
            <Svg height="100%" width="100%">
                <Defs>
                    <Mask id="mask" x="0" y="0" height="100%" width="100%">
                        <Rect height="100%" width="100%" fill="#fff" />
                        <Circle r={(width) / 2} cx="50%" cy="50%"
                            fill="black"
                        />
                    </Mask>
                </Defs>
                <Rect height="100%" width="100%" fill="rgba(0, 0, 0, 0.8)" mask="url(#mask)" fill-opacity="0" />
            </Svg>
        )
    };

    render() {
        const { canDetectFaces, percentage } = this.state;
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
                    style={[styles.container, {
                        backgroundColor: '#FFFFFF',

                    }]}
                    type={RNCamera.Constants.Type.front}
                    // flashMode={this.state.flash}
                    // autoFocus={this.state.autoFocus}
                    autoFocusPointOfInterest={this.state.autoFocusPoint.normalized}
                    faceDetectionClassifications={RNCamera.Constants.FaceDetection.Classifications
                        ? RNCamera.Constants.FaceDetection.Classifications.all
                        : undefined}
                    // zoom={0.005}
                    // ratio="16:9"
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
                    <View
                        style={{
                            flex: 1
                        }}
                    >
                        <View style={{
                            position: 'absolute',
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%'
                        }}>
                            <View onLayout={({ nativeEvent }) => {
                                console.log(JSON.stringify(nativeEvent))
                                this.xLeftTop = nativeEvent.layout.x
                                this.yLeftTop = nativeEvent.layout.y
                            }} style={{
                                borderWidth: 1,
                                borderColor: 'red',
                                height: width,
                                width: width,
                                borderRadius: (width) / 2
                            }}>
                                <AnimatedCircularProgress
                                    size={width - 3}
                                    width={15}
                                    fill={percentage}
                                    rotation={360}
                                    tintColor="#00e0ff"
                                    // onAnimationComplete={() => console.log('onAnimationComplete')}
                                    backgroundColor="#3d5875"

                                    // dashedBackground={{ width: 20, gap: 20 }}
                                    dashedTint={{ width: 20, gap: 20 }}
                                />
                            </View>
                        </View>

                        <View style={{ flex: 1 }}>
                            {this.WrappedSvg()}
                        </View>

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

                        <View style={[styles.flipButton, {
                            backgroundColor: 'white',
                            opacity: 0.5,
                            alignSelf: 'stretch'
                        }]}>
                            {this.state.dataError.map((item) => {
                                return (
                                    <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 12 }}>
                                        <IconView
                                            name={item.trangThai ? 'verified' : 'cancel'}
                                            size={18}
                                            color={item.trangThai ? "blue" : 'red'}
                                        />
                                        <Text style={[styles.flipText, { color: item.trangThai ? "blue" : 'red', textAlign: 'left', fontWeight: 'bold', alignSelf: 'stretch', marginLeft: 12, flex: 1 }]}>
                                            {item.title}
                                        </Text>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                </RNCamera>
            </View >
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
        position: 'absolute',
        bottom: 0,
        width: '90%'
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
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(CameraScreen)