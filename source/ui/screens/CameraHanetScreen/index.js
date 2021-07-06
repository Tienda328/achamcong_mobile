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
    Alert,
    Image
} from 'react-native';
// eslint-disable-next-line import/no-unresolved
import { RNCamera } from 'react-native-camera';
import { connect } from 'react-redux';
import { api } from '../../../commons/api/Api';
import { actions } from '../../../commons/action';
// import ImagePicker from 'react-native-image-crop-picker';
import { commonsConfigs as configs } from '../../../commons';
import BaseViewAdmin from '../HomeAdminScreen/component/BaseViewAdmin'
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window')

class CameraScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            image: ""
        }

        this.selectPhotoTapped = this.selectPhotoTapped.bind(this)
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

    selectPhotoTapped = () => {
        // ImagePicker.openCamera({
        //     width: 1280,
        //     height: 736,
        //     cropping: true,
        //     includeBase64: true
        // }).then(image => {
        //     this.setState({image: image&& image.cropRect && image.cropRect})
        //     console.log(image);
        // });
    }

    render() {
        return (
            <BaseViewAdmin stylesView={{ flex: 1, backgroundColor: 'white' }}
                titleScreen={"Cài đặt hình ảnh"}
                subTitle={'havantam.it@gmail.com'}
                styleToolbar={{ height: 45 }}
                isBorderBottomWidth={false}
                styleTitle={[styles.styleTitle, { textAlign: 'center' }]}
                styleTitleToolbarBase={[styles.styleTitleToolbarBase, { color: 'white' }]}
                styleContent={{ flex: 1, position: 'relative', alignItems: 'center' }}
            >
                <LinearGradient
                    locations={[0, 0.5, 0.8]}
                    colors={['#809fff', '#99b3ff', '#b3c6ff']}
                    style={{
                        position: 'absolute',
                        height: 200,
                        borderBottomEndRadius: 24,
                        borderBottomStartRadius: 24,
                        width: '100%'
                    }}>

                </LinearGradient>

                <View style={{
                    alignItems: 'center', marginTop: 200 - width * 3 / 8, elevation: 3, shadowColor: 'gray', borderRadius: width * 3 / 8,
                    width: width * 3 / 4,
                    height: width * 3 / 4,
                }}>
                    <Image
                        source={require('../../../assets/image/logo_datviet.png')}
                        style={{
                            width: width * 3 / 4,
                            height: width * 3 / 4,
                            borderRadius: width * 3 / 8,
                        }}
                    />

                    <TouchableOpacity onPress={this.selectPhotoTapped} style={{
                        position: 'absolute', top: -45,
                        borderRadius: 45, width: 90, height: 90, backgroundColor: configs.colorMain,
                        elevation: 3,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Image
                            source={require('../../../assets/image/icon_camera1.png')}
                            style={{
                                width: 45,
                                height: 45,
                                tintColor: 'white'
                            }}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{
                    flex: 1, width: '100%',
                    justifyContent: 'flex-end',
                }}>
                    <TouchableOpacity style={{
                        backgroundColor: configs.colorMain,
                        justifyContent: 'center', alignItems: 'center',
                        borderRadius: 8, borderWidth: 1, borderColor: 'gray', height: 48,
                        margin: 12,
                    }}>
                        <Text style={[styles.styleTitle, { color: 'white', fontWeight: 'bold', fontSize: 18 }]}>{'Cập nhật hình ảnh'}</Text>
                    </TouchableOpacity>
                </View>
            </BaseViewAdmin>
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
        // margin: 50,
        width: '100%'
    },
    styleTitleToolbarBase: {
        color: 'black',
        fontSize: 18,
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