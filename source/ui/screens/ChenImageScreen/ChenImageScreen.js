/* eslint-disable no-console */
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Slider,
    FlatList,
    Dimensions,
    BackHandler,
    Alert,
    Image
} from 'react-native';
// eslint-disable-next-line import/no-unresolved
import { RNCamera } from 'react-native-camera';
import { connect } from 'react-redux';
import { api } from '../../../commons/api/Api';
import { commonsConfigs as configs } from '../../../commons'
import { actions } from '../../../commons/action';

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
        canDetectFaces: true,
        faces: [],
        dataListImage: []
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
        // if (this.props.ChamCongReducer) {
        //     if (this.props.ChamCongReducer.isChamCong && this.props.ChamCongReducer.isChamCong !== '') {
        //         setTimeout(() => {
        //             Alert.alert(
        //                 configs.NAME_APP,
        //                 this.props.ChamCongReducer.isChamCong,
        //                 [
        //                     {
        //                         text: configs.DONG_Y, onPress: () => {
        //                             this.props.requestDataChamCong()
        //                             this.backPressed()
        //                             this.props.navigation.state.params.responsesResetData()
        //                         }
        //                     }
        //                 ],
        //             );
        //         }, 700);

        //     }
        // }
    }

    takePicture = async () => {
        if (this.camera) {
            let options = {
                quality: 0.5, base64: true, height: 700, forceUpOrientation: true,
                fixOrientation: true, mirrorImage: true, doNotSave: false
            };
            var params = this.state.dataListImage
            await this.camera.takePictureAsync(options) // options)
                .then(data => {
                    params.push({
                        uriBase64: "data:image/jpg;base64," + data.base64
                    })
                })
                .catch(error => console.log('eror', error));

            this.setState({
                canDetectFaces: false,
                dataListImage: params
            }, () => {
                setTimeout(() => {
                    this.props.hideLoadding()
                    Alert.alert(
                        configs.APP_NAME,
                        this.state.dataListImage.length === 6 ? "Bạn đã chụp đủ 6 ảnh." : "Đã thêm 1 ảnh thành công. Bạn có muốn tiếp tục?",
                        [
                            {
                                text: 'Hủy', onPress: () => {
                                }
                            },
                            {
                                text: 'Đồng ý', onPress: () => {
                                    if (this.state.dataListImage.length !== 6) {
                                        this.setState({
                                            canDetectFaces: true,
                                        })
                                    }
                                }
                            },
                        ]
                    );
                }, 700);
            })
        }
    };

    toggle = value => () => this.setState(prevState => ({ [value]: !prevState[value] }));

    onPressDeleteImage = (data) => {
        Alert.alert(
            configs.APP_NAME,
            "Bạn có thực muốn xóa hình ảnh này?",
            [
                {
                    text: 'Đồng ý', onPress: () => {
                        let dataList = this.state.dataListImage
                        let index = dataList.indexOf(data)
                        if (index > -1) {
                            dataList.splice(index, 1);
                        }
                        this.setState({
                            dataListImage: dataList,
                            canDetectFaces: false,
                        })
                    }
                },
                {
                    text: 'Hủy', onPress: () => {
                    }
                },
            ]
        );
    }

    onFinishChenImage = () => {
        this.backPressed()
        this.props.navigation.state.params.responsesResetData(this.state.dataListImage)
    }

    facesDetected = ({ faces }) => {
        this.setState({ faces })
    };

    renderFace = ({ bounds, faceID, rollAngle, yawAngle }) => {
        if (rollAngle > -2 && rollAngle < 2 && yawAngle > -2 && yawAngle < 2) {
            console.log("rollAngle:    ", rollAngle)
            console.log("yawAngle:    ", yawAngle)
            this.props.showLoadding()
            this.setState({
                faces: [],
                canDetectFaces: false
            })
            this.takePicture()
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
                <Text style={styles.faceText}>{'Đang nhận diện khuôn mặt'}</Text>
            </View>
        );
    }

    renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => {
                this.onPressDeleteImage(item)
            }} style={{ paddingHorizontal: 8 }}>
                <Image
                    source={{ uri: item.uriBase64 }}
                    // source={{ uri: "https://cdn.24h.com.vn/upload/4-2018/images/2018-12-14/1544763378-9-active-1-1544762542-width660height759.jpg" }}
                    style={{ width: 50, height: 70 }}
                />
            </TouchableOpacity>
        )
    }

    renderFaces = () => (
        <View style={styles.facesContainer} pointerEvents="none">
            {this.state.faces.map(this.renderFace)}
        </View>
    );

    openNhanDienKhuanMat = (isCanDetectFaces) => {
        if (this.state.dataListImage.length === 6) {
            configs.showAlert("Bạn đã chụp đủ 6 ảnh.")
        } else {
            this.setState({
                canDetectFaces: true
            })
        }
    }

    render() {
        const { canDetectFaces } = this.state;
        return (
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
                <View style={{
                    flexDirection: 'row', justifyContent: 'space-between',
                    marginTop: 30,
                }}>
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            paddingHorizontal: 12, paddingVertical: 8,
                            justifyContent: 'center',
                            backgroundColor: configs.colorMain,
                            borderRadius: 6,
                            alignItems: 'center', marginLeft: 12
                        }}
                        onPress={this.openNhanDienKhuanMat.bind(this)}
                    >
                        <Text style={{
                            color: 'white'
                        }}>{'Tiếp tục'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            paddingHorizontal: 12, paddingVertical: 8,
                            justifyContent: 'center',
                            backgroundColor: configs.colorMain,
                            borderRadius: 6,
                            alignItems: 'center', marginRight: 12
                        }}
                        onPress={this.onFinishChenImage.bind(this)}
                    >
                        <Text style={{
                            color: 'white'
                        }}>{'Xong'}</Text>
                    </TouchableOpacity>
                </View>

                {this.state.dataListImage.length !== 0 &&
                    <View
                        style={{
                            backgroundColor: 'transparent',
                            justifyContent: 'flex-end',
                            flex: 1,
                            position: 'relative'
                        }}
                    >
                        <View style={{
                            backgroundColor: 'white',
                            opacity: 0.5,
                            height: 120, position: 'absolute',
                            bottom: 0, left: 0,
                            width: '100%'
                        }}>

                        </View>
                        <View style={{

                        }}>
                            <Text style={[styles.styleTitle, { fontWeight: 'bold', color: 'white', marginLeft: 12 }]}>{"Số ảnh đã chụp"}</Text>

                            <FlatList
                                style={{ paddingVertical: 12 }}
                                horizontal={true}
                                data={this.state.dataListImage}
                                renderItem={this.renderItem}
                                // keyExtractor={item => item.id.toString()}
                                numColumns={1}
                            />

                        </View>
                    </View>}
                {!!canDetectFaces && this.renderFaces()}
            </RNCamera>
        )
    }
}

const styles = StyleSheet.create({
    styleTitle: {
        fontSize: configs.fontSize14_5,
        fontFamily: 'Lato-Regular',
        color: 'black',
    },
    container: {
        backgroundColor: '#000',
        flex: 1,
        // margin: 50
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
        showLoadding: () => {
            dispatch(actions.showLoading())
        },
        hideLoadding: () => {
            dispatch(actions.hideLoading())
        },
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(CameraScreen)