/* eslint-disable no-console */
import React from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    StatusBar,
    FlatList,
    Alert, Switch, BackHandler
} from 'react-native';
import { BaseComponent, BaseView, IconView, Checkbox, InputView } from '../../components/index';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { commonsConfigs as configs } from '../../../commons'
import { StackActions, NavigationActions } from 'react-navigation'
import Toast from 'react-native-simple-toast'
import { api } from '../../../commons/api/Api';
import { actions } from '../../../commons/action';
import ReactNativeBiometrics from 'react-native-biometrics'
import { models } from '../../../commons/model';

const landmarkSize = 2;
const { width, height } = Dimensions.get('window')
const heightView = width - 100

class FaceIdBiometricsScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isCheckPermisionFaceId: false,
            isCheckTypeFaceId: false,
            isCheckFaceIdAuthentication: false

        };

        this.dataLogin = models.getDataLogin()

        this.toggleSwitchOnOffPermision = this.toggleSwitchOnOffPermision.bind(this)
        this.createKeysFaceId = this.createKeysFaceId.bind(this)
    }


    componentDidMount() {
        this.checkPermisioFaceID()
        BackHandler.addEventListener('hardwareBackPress', this.backPressed);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    }

    backPressed = () => {
        this.props.navigation.goBack();
        return true;
    }

    async checkPermisioFaceID() {
        this.props.showLoadding()
        const { biometryType } = await ReactNativeBiometrics.isSensorAvailable()
        this.setState({ isCheckTypeFaceId: (biometryType === ReactNativeBiometrics.FaceID) })
        this.props.hideLoadding()
    }

    createKeysFaceId = () => {
        ReactNativeBiometrics.createKeys('Confirm fingerprint')
            .then((resultObject) => {
                const { publicKey } = resultObject
                let epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString()
                ReactNativeBiometrics.createSignature({
                    promptMessage: 'AChamCong',
                    payload: " Ninjateam AChamCong"
                })
                    .then((resultObject) => {
                        const { success, signature } = resultObject
                        console.log("success:     ", success)
                        console.log("signature:     ", signature)
                        Toast.show('X??c th???c face id th??nh c??ng.');
                        this.setState({ isCheckFaceIdAuthentication: success })
                        if (!success) {
                            Toast.show('X??c th???c face id th???t b???i.');
                            // configs.showAlert("Kh??ng x??c th???c ???????c face id. Vui l??ng ki???m tra l???i")
                        }
                    })
            })
    }

    deleteKeyFaceId = () => {
        ReactNativeBiometrics.deleteKeys()
            .then((resultObject) => {
                const { keysDeleted } = resultObject
                if (keysDeleted) {
                    this.setState({ isCheckFaceIdAuthentication: false })
                    configs.showAlert("X??a face id th??nh c??ng")
                } else {
                    configs.showAlert('X??a kh??ng th??nh c??ng v?? kh??ng c?? kh??a ????? x??a')
                }
            })
    }

    toggleSwitchOnOffPermision = () => {
        let { isCheckPermisionFaceId } = this.state
        this.setState({ isCheckPermisionFaceId: !isCheckPermisionFaceId }, () => {
            // this.settingAdminPermission()
            ReactNativeBiometrics.biometricKeysExist()
                .then((resultObject) => {
                    const { keysExist } = resultObject

                    if (keysExist) {
                        console.log('Keys exist    ', keysExist)
                    } else {
                        configs.showAlert("Face id kh??ng t???n t???i ho???c ???? ???????c x??a")
                    }
                })
        })
    }

    render() {
        let { isCheckPermisionFaceId, isCheckTypeFaceId, isCheckFaceIdAuthentication } = this.state
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {!isCheckFaceIdAuthentication ? <TouchableOpacity onPress={this.createKeysFaceId} style={[styles.containerStyle, styles.viewRow]}>
                    <IconView
                        name={"change-people"}
                        size={configs.sizeIcon18}
                        color={configs.colorOrange}
                    />

                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[styles.styleValue]}>{'X??c th???c face id'}</Text>
                        <Text style={[styles.styleValue, { color: 'red', fontStyle: 'italic', fontSize: 10 }]}>{'M???c ????ch thay th??? ch???p ???nh ch???m c??ng b???ng x??c th???c face id'}</Text>
                    </View>

                    <IconView
                        name={'right-arrow1'}
                        size={24}
                    />
                </TouchableOpacity> : <View />}

                {isCheckFaceIdAuthentication ? <TouchableOpacity onPress={this.toggleSwitchOnOffPermision} style={[styles.containerStyle, styles.viewRow]}>
                    <IconView
                        name={"change-people"}
                        size={configs.sizeIcon18}
                        color={configs.colorOrange}
                    />

                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[styles.styleValue]}>{'Ch???m c??ng b???ng face id'}</Text>
                        {!isCheckTypeFaceId ? <Text style={[styles.styleValue, { color: 'red', fontStyle: 'italic', fontSize: 10 }]}>{'Ch?? ??: thi???t b??? c???a b???n kh??ng h??? tr??? face id'}</Text> : <View />}
                    </View>

                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isCheckPermisionFaceId ? "red" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={this.toggleSwitchOnOffPermision}
                        value={isCheckPermisionFaceId}
                    />
                </TouchableOpacity> : <View />}

                {isCheckFaceIdAuthentication ? <TouchableOpacity onPress={this.deleteKeyFaceId} style={[styles.containerStyle, styles.viewRow]}>
                    <IconView
                        name={"change-people"}
                        size={configs.sizeIcon18}
                        color={configs.colorOrange}
                    />

                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[styles.styleValue]}>{'H???y li??n k???t face id v???i t??i kho???n n??y'}</Text>
                    </View>

                    <IconView
                        name={'right-arrow1'}
                        size={24}
                    />
                </TouchableOpacity> : <View />}
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009387'
    },
    styleValue: {
        fontFamily: 'Lato-Regular',
        fontSize: configs.fontSize14,
        color: configs.colorText,
    },

    styleTextInput: {
        marginBottom: configs.marginBottom15,
        height: configs.heightInput,
        width: '90%',
        marginLeft: configs.marginLeft20,
        marginRight: configs.marginRight20,
    },
    containerStyle: {
        paddingTop: configs.paddingTop,
        paddingBottom: configs.paddingBottom,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    viewRow: {
        backgroundColor: 'white',
        height: 50,
        paddingHorizontal: configs.padding15,
        borderBottomColor: configs.colorBorder,
        borderBottomWidth: 1
    },
    styleTitleToolbarBase: {
        color: 'black',
        fontSize: 18,
    },
    styleViewIconLeftBase: {
        padding: configs.padding,
        width: configs.heightToolBar,
        justifyContent: 'center',
        alignItems: 'flex-start',
        left: configs.marginLeft10,
    },
    styleTitle: {
        flexDirection: 'row'
    }
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
export default connect(mapStateToProps, mapDispatchToProps)(FaceIdBiometricsScreen)