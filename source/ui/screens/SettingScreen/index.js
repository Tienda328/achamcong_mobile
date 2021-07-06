import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  StatusBar,
  FlatList,
  Alert,
  Switch,
  BackHandler,
} from 'react-native';
import {
  BaseComponent,
  BaseView,
  IconView,
  Checkbox,
  InputView,
} from '../../components/index';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { commonsConfigs as configs } from '../../../commons';
import { StackActions, NavigationActions } from 'react-navigation';
import { api } from '../../../commons/api/Api';
import { actions } from '../../../commons/action';
import { models } from '../../../commons/model';
import RNExitApp from 'react-native-exit-app';
import RenderItem from './component/renderItem';
import BaseViewAdmin from '../HomeAdminScreen/component/BaseViewAdmin';
import ReactNativeBiometrics from 'react-native-biometrics';
import Toast from 'react-native-simple-toast';
import DeviceInfo from 'react-native-device-info';
import Popup from '../../components/Dialog';
import Root from '../../components/Root';


class SettingScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.adminPermission = models.getStatusAdmin();
    this.dataLogin = models.getDataLogin();
    console.log('this.dataLogin:    ', this.dataLogin);
    this.state = {
      isEnabledCheckLocation: !this.adminPermission,
      reRender: false,

      isCheckPermisionFaceId: this.dataLogin.isCheckinFromFaceId, // có chấm công = face id ?
      isCheckTypeFaceId: false, // điện thoại có quyên face id hay không
      isCheckFaceIdAuthentication:
        this.dataLogin.idCheckInFaceId === '' ? false : true, //đã xác thực face id?
    };

    this.toggleSwitchAdminPermission = this.toggleSwitchAdminPermission.bind(
      this,
    );
    this.settingAdminPermission = this.settingAdminPermission.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.loadChangeCheck = this.loadChangeCheck.bind(this);
    this.handleMenu = this.handleMenu.bind(this);
    this.addImageCamera = this.addImageCamera.bind(this);

    this.toggleSwitchOnOffPermision = this.toggleSwitchOnOffPermision.bind(
      this,
    );
    this.createKeysFaceId = this.createKeysFaceId.bind(this);
    this.deleteKeyFaceId = this.deleteKeyFaceId.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  handleMenu = () => {
    if (this.props.handleMenu) {
      this.props.handleMenu();
    } else {
      this.props.navigation.goBack();
      return true;
    }
  };

  componentDidMount() {
    if (this.dataLogin.permission === 1) {
      this.props.getAdminShift();
    }

    // console.log('DeviceInfo.getUniqueId():    ', DeviceInfo.getUniqueId());

    this.checkPermisioFaceID();
    BackHandler.addEventListener('hardwareBackPress', this.handleMenu);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleMenu);
  }

  addImageCamera = () => {
    this.props.navigation.navigate('CameraHanetScreen');
  };


  requestLogout = async () => {
    await this.props.getLogout();
    if (models.deleteAllData()) {
      this.props.navigation.dispatch(
        StackActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({ routeName: 'LoginScreen' })],
        }),
      );
    } else {
      configs.showAlert('Đã có lỗi xảy ra khi đăng xuất, vui lòng thử lại');
    }
  };

  settingAdminPermission = () => {

    // this.adminPermission = models.getStatusAdmin();
    
    let status = models.getStatusAdmin();
    console.log("admin", status);

  
    Popup.show({
      type: 'Warning',
      title: configs.APP_NAME,
      textBody:
        'Bạn muốn chuyển sang chế độ ' + (status ? 'admin ' : 'nhân viên ') + "?",
      button: true,
      buttonCancel: true,
      callback: () => {
        models.insertStatusAdmin({
          id: 1,
          statusAdmin: !status,
        });
        this.props.navigation.navigate('SplashScreen')
        Popup.hide()
      },
      callbackOk: () => Popup.hide(),
    });

  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.SettingReducer) {
      if (
        this.props.SettingReducer.dataAdminShift &&
        this.props.SettingReducer.dataAdminShift !==
        prevProps.SettingReducer.dataAdminShift
      ) {
        this.dataList = this.props.SettingReducer.dataAdminShift;
        this.reRender();
      }

      if (this.props.SettingReducer.isCreateFaceId) {
        this.props.requertIsCreateFaceId();
        Toast.show('Xác thực face id thành công.');
        this.setState({
          isCheckFaceIdAuthentication: true,
          isCheckPermisionFaceId: true,
        });
      }

      if (this.props.SettingReducer.isUpdateStatus) {
        this.props.requertIsUpdateStatus();
        // Toast.show('Xác thực face id thành công.');
        models.changeIsCheckInFaceId(!this.state.isCheckPermisionFaceId);
        this.setState({
          isCheckPermisionFaceId: !this.state.isCheckPermisionFaceId,
        });
      }
    }
  }

  reRender = () => {
    this.setState((prevState) => ({
      reRender: (prevState.reRender = !this.state.reRender),
    }));
  };

  toggleSwitchAdminPermission = (data) => {
    let { isEnabledCheckLocation } = this.state;
    this.setState({ isEnabledCheckLocation: !isEnabledCheckLocation }, () => {
      this.settingAdminPermission();
    });
  };

  loadChangeCheck = (params) => {
    this.props.postAdminShift(params);
  };

  ///check face id
  async checkPermisioFaceID() {
    this.props.showLoadding();
    const { biometryType } = await ReactNativeBiometrics.isSensorAvailable();
    await ReactNativeBiometrics.biometricKeysExist().then((resultObject) => {
      const { keysExist } = resultObject;
      // console.log('ddax ton tai face id, ', keysExist);
      if (keysExist) {
      } else {
      }
    });

    this.setState({
      isCheckTypeFaceId: biometryType === ReactNativeBiometrics.FaceID,
    });
    this.props.hideLoadding();
  }

  createKeysFaceId = async () => {
    this.props.showLoadding();
    await ReactNativeBiometrics.biometricKeysExist().then((resultObject) => {
      const { keysExist } = resultObject;
      console.log('Đã tòn tại face id:   ', keysExist);
      if (keysExist) {
        ReactNativeBiometrics.createSignature({
          promptMessage: 'AChamCong',
          payload: 'Ninjateam AChamCong',
        }).then((resultObject) => {
          const { success, signature } = resultObject;
          console.log('signature:     ', signature);

          if (!success) {
            Toast.show('Xác thực face id thất bại.');
            // configs.showAlert("Không xác thực được face id. Vui lòng kiểm tra lại")
          } else {
            // models.changeDataIdCheckInFaceId(signature)
            this.props.createFaceId({ face_id: signature });
          }
        });
      } else {
        ReactNativeBiometrics.createKeys('Confirm fingerprint').then(
          (resultObject) => {
            ReactNativeBiometrics.createSignature({
              promptMessage: 'AChamCong',
              payload: 'Ninjateam AChamCong',
            }).then((resultObject) => {
              const { success, signature } = resultObject;
              console.log('signature:     ', signature);

              if (!success) {
                Toast.show('Xác thực face id thất bại.');
              } else {
                this.props.createFaceId({ face_id: signature });
              }
            });
          },
        );
      }
    });
  };

  deleteKeyFaceId = () => {
    ReactNativeBiometrics.deleteKeys().then((resultObject) => {
      const { keysDeleted } = resultObject;
      if (keysDeleted) {
        // this.setState({ isCheckFaceIdAuthentication: false })
        // configs.showAlert("Xóa face id thành công")
      } else {
        // configs.showAlert('Xóa không thành công vì không có khóa để xóa')
      }
    });
  };

  toggleSwitchOnOffPermision = () => {
    if (this.state.isCheckPermisionFaceId) {
      this.props.updateStatusIsCheckFaceId();
    } else {
      ReactNativeBiometrics.createSignature({
        promptMessage: 'AChamCong',
        payload:
          'Ninjateam AChamCong ' + this.dataLogin.id + this.dataLogin.email,
      }).then((resultObject) => {
        const { success, signature } = resultObject;
        console.log('signature:     ', signature);

        if (!success) {
          Toast.show('Xác thực face id thất bại.');
          // configs.showAlert("Không xác thực được face id. Vui lòng kiểm tra lại")
        } else {
          // models.changeDataIdCheckInFaceId(signature)
          if (signature === this.dataLogin.idCheckInFaceId) {
            this.props.updateStatusIsCheckFaceId();
          } else {
            configs.showAlert(
              'Dữ liệu face id khác với dữ liệu server. Vui lòng liên hệ với admin để được hỗ trợ.',
            );
          }
          // this.props.createFaceId({ face_id: signature })
        }
      });
    }
  };
  ////

  onLogout = () => {
    Popup.show({
      type: 'Warning',
      title: 'Cảnh báo đăng xuất',
      textBody:
        'Bạn có thực muốn đăng xuất khỏi tài khoản này hay không',
      button: true,
      buttonCancel: true,
      callback: () => this.props.navigation.navigate('LoginScreen'),
      callbackOk: () => Popup.hide(),
    });
    // Alert.alert(
    //   'Cảnh báo đăng xuất',
    //   'Bạn có thực muốn đăng xuất khỏi tài khoản này hay không',
    //   [
    //     {
    //       text: configs.DONG_Y,
    //       onPress: () => {
    //         if (models.deleteAllData()) {
    //           this.props.navigation.dispatch(
    //             StackActions.reset({
    //               index: 0,
    //               key: null,
    //               actions: [
    //                 NavigationActions.navigate({ routeName: 'SplashScreen' }),
    //               ],
    //             }),
    //           );
    //         } else {
    //           configs.showAlert(
    //             'Đã có lỗi xảy ra khi đăng xuất, vui lòng thử lại',
    //           );
    //         }
    //       },
    //     },
    //     {
    //       text: configs.HUY,
    //       onPress: () => { },
    //     },
    //   ],
    // );
  };

  renderItem = ({ item, index }) => {
    return (
      <RenderItem
        dataItem={item}
        index={index + 1}
        loadChangeCheck={this.loadChangeCheck}
      />
    );
  };

  render() {
    let {
      isEnabledCheckLocation,
      isCheckPermisionFaceId,
      isCheckTypeFaceId,
      isCheckFaceIdAuthentication,
    } = this.state;
    return (
      <Root>
        <BaseViewAdmin
          isShowIconLeft={this.props.handleMenu ? true : false}
          onClickBack={this.handleMenu}
          isShowLogo={this.props.handleMenu ? false : true}
          stylesView={{ flex: 1, backgroundColor: 'white' }}
          titleScreen={'Cài đặt admin'}
          subTitle={'havantam.it@gmail.com'}
          styleToolbar={{ height: 45 }}
          isBorderBottomWidth={false}
          styleTitle={[styles.styleTitle]}
          styleTitleToolbarBase={[
            styles.styleTitleToolbarBase,
            { color: 'white' },
          ]}>
          {this.dataLogin.permission === 1 && (
            <TouchableOpacity
              onPress={this.toggleSwitchAdminPermission}
              style={[styles.containerStyle, styles.viewRow]}>
              <IconView
                name={'change-people'}
                size={configs.sizeIcon18}
                color={configs.colorOrange}
              />

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.styleValue]}>
                  {"Chế độ admin"}
                </Text>
              </View>

              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isEnabledCheckLocation ? 'red' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={this.toggleSwitchAdminPermission}
                value={!models.getStatusAdmin()}
              />
            </TouchableOpacity>
          )}

          {!isCheckFaceIdAuthentication ? (
            <TouchableOpacity
              disabled={!isCheckTypeFaceId}
              onPress={this.createKeysFaceId}
              style={[styles.containerStyle, styles.viewRow]}>
              <IconView
                name={'verified'}
                size={configs.sizeIcon18}
                color={configs.colorOrange}
              />

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text
                  style={[
                    styles.styleValue,
                    {
                      color: isCheckTypeFaceId
                        ? configs.colorText
                        : configs.colorIcon,
                    },
                  ]}>
                  {'Xác thực face id'}
                </Text>
                <Text
                  style={[
                    styles.styleValue,
                    { color: 'red', fontStyle: 'italic', fontSize: 10 },
                  ]}>
                  {isCheckTypeFaceId
                    ? 'Mục đích thay thế chụp ảnh chấm công bằng xác thực face id'
                    : 'Chú ý: thiết bị của bạn không hỗ trợ face id'}
                </Text>
              </View>

              <IconView name={'right-arrow1'} size={24} />
            </TouchableOpacity>
          ) : (
            <View />
          )}

          {isCheckFaceIdAuthentication ? (
            <TouchableOpacity
              disabled={!isCheckTypeFaceId}
              onPress={this.toggleSwitchOnOffPermision}
              style={[styles.containerStyle, styles.viewRow]}>
              <IconView
                name={'verified'}
                size={configs.sizeIcon18}
                color={configs.colorOrange}
              />

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.styleValue]}>
                  {'Chấm công bằng face id'}
                </Text>
                {!isCheckTypeFaceId ? (
                  <Text
                    style={[
                      styles.styleValue,
                      { color: 'red', fontStyle: 'italic', fontSize: 10 },
                    ]}>
                    {'Chú ý: thiết bị của bạn không hỗ trợ face id'}
                  </Text>
                ) : (
                  <View />
                )}
              </View>

              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isCheckPermisionFaceId ? 'red' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={this.toggleSwitchOnOffPermision}
                value={!models.getStatusAdmin()}
              />
            </TouchableOpacity>
          ) : (
            <View />
          )}

          {/* {isCheckFaceIdAuthentication ? <TouchableOpacity onPress={this.deleteKeyFaceId} style={[styles.containerStyle, styles.viewRow]}>
                    <IconView
                        name={"warning"}
                        size={configs.sizeIcon18}
                        color={configs.colorOrange}
                    />

                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[styles.styleValue]}>{'Hủy liên kết face id với tài khoản này'}</Text>
                    </View>

                    <IconView
                        name={'right-arrow1'}
                        size={24}
                    />
                </TouchableOpacity> : <View />} */}
          {/* ket thuc face id */}

          {/* <TouchableOpacity onPress={this.addImageCamera} style={[styles.containerStyle, styles.viewRow]}>
                    <IconView
                        name={"person-add"}
                        size={configs.sizeIcon18}
                        color={configs.colorOrange}
                    />

                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[styles.styleValue]}>{'Thêm hình ảnh camera'}</Text>
                    </View>

                    <IconView
                        name={'right-arrow1'}
                        size={20}
                    />
                </TouchableOpacity> */}

          <TouchableOpacity
            onPress={this.onLogout}
            style={[styles.containerStyle, styles.viewRow]}>
            <IconView
              name={'logout'}
              size={configs.sizeIcon18}
              color={configs.colorOrange}
            />

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.styleValue]}>{'Đăng xuất'}</Text>
            </View>

            <IconView name={'right-arrow1'} size={20} />
          </TouchableOpacity>

          {this.dataLogin.permission === 1 && (
            <FlatList
              style={{ backgroundColor: configs.bgNen }}
              data={this.dataList}
              // ItemSeparatorComponent={this.viewSeparator}
              showsHorizontalScrollIndicator={false}
              renderItem={this.renderItem}
              keyExtractor={(item) => item.id.toString()}
            />
          )}
        </BaseViewAdmin>
      </Root>
    );
  }
}

const mapStateToProps = (state) => ({
  SettingReducer: state.SettingReducer,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getAdminShift: () => {
      api.getAdminShift(dispatch);
    },
    postAdminShift: (params) => {
      api.postAdminShift(dispatch, params);
    },
    requertIsCreateFaceId: () => {
      dispatch(actions.requertIsCreateFaceId(null));
    },
    createFaceId: (params) => {
      api.createFaceId(dispatch, params);
    },
    updateStatusIsCheckFaceId: (params) => {
      api.updateStatusIsCheckFaceId(dispatch, params);
    },
    requertIsUpdateStatus: () => {
      dispatch(actions.requertIsUpdateStatus(null));
    },
    showLoadding: () => {
      dispatch(actions.showLoading());
    },
    hideLoadding: () => {
      dispatch(actions.hideLoading());
    },
    getLogout: (params) => {
      api.getLogout(dispatch);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009387',
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
    borderBottomWidth: 1,
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
    flexDirection: 'row',
  },
});
