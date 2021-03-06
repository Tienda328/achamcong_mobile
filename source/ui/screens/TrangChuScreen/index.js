import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Dimensions,
  Alert,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import { BaseComponent, IconView, Offcanvas3dMenu } from '../../components';
import DoiMatKhauScreen from '../DoiMatKhauScreen';
import BaoCaoScreen from '../BaoCaoScreen';
import CheckInScreen from '../CheckInScreen';
import ThongTinNguoiDungScreen from '../ThongTinNguoiDungScreen';
import SettingScreen from '../SettingScreen';
import ThongBaoScreen from '../ThongBaoScreen';
import LocBaoCaoScreen from '../LocBaoCaoScreen';
import DialogChiTietNguoiDung from './component/DialogChiTietNguoiDung';
import { StackActions, NavigationActions } from 'react-navigation';
import { commonsConfigs as configs } from '../../../commons';
import { models } from '../../../commons/model';
import { api } from '../../../commons/api/Api';
import HistoryXinPhepScreen from '../HistoryXinPhepScreen';
import XinPhepScreen from '../XinPhepScreen';
import Geolocation from '@react-native-community/geolocation';
import Popup from '../../components/Dialog';
import Root from '../../components/Root';

const icon_user = require('../../../assets/image/hinhbia.jpg');
class TrangChuScreen extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = {
      isFaceDetected: false,
      menuOpen: false,
      isShowDialog: false,
      reRender: false,
    };
    this.handleMenu = this.handleMenu.bind(this);
    this.dataLogin = models.getDataLogin();
    this.adminPermission = models.getStatusAdmin();
    console.log(JSON.stringify(this.dataLogin));
  }

  backPressed = () => {
    this.handleMenu();
    return true;
  };

  componentDidMount() {
    // console.log('DIDMOUNT TRANG CHUUUU');
    BackHandler.addEventListener('hardwareBackPress', this.backPressed);
    // console.log('Didmount trangchu screen');
    // this.timer = setInterval(() => {
    //   // console.log('inside set interval');
    //   this.updateLocation();
    // }, 900000);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    // clearInterval(this.timer);
  }

  updateLocation = () => {
    // Get current location
    Geolocation.getCurrentPosition(
      (position) => {
        let location = position.coords;
        let params = {
          location: `${location.latitude},${location.longitude}`,
        };
        console.log('update location with params: ', params);
        this.props.updateLocation(params);
      },
      (error) => {
        // Get location error
        console.log('get location error: ', error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 120000 },
    );
  };

  handleMenu = (index) => {
    let { menuOpen } = this.state;
    this.setState({
      menuOpen: !menuOpen,
    });
    if (!isNaN(index)) {
      //this.adminPermission false: ??ang ??? ch??? ????? th?????ng cho admin
      let indexDangSuat = 8;
      let isStatusAdmin =
        this.dataLogin.permission === 1 ? (this.adminPermission ? 9 : 7) : -1;
      switch (index) {
        case indexDangSuat:
          Popup.show({
            type: 'Warning',
            title: 'C???nh b??o ????ng xu???t',
            textBody: 'B???n c?? th???c mu???n ????ng xu???t kh???i t??i kho???n n??y hay kh??ng',
            button: true,
            buttonCancel: true,
            callback: () => this.requestLogout(),
            callbackOk: () => Popup.hide(),
          });

          // Alert.alert(
          //   'C???nh b??o ????ng xu???t',
          //   'B???n c?? th???c mu???n ????ng xu???t kh???i t??i kho???n n??y hay kh??ng',
          //   [
          //     {
          //       text: configs.DONG_Y,
          //         this.requestLogout();
          //       },
          //     },
          //     {
          //       text: configs.HUY,
          //       onPress: () => { },
          //     },
          //   ],
          // );
          break;
      }
    }
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
      configs.showAlert('???? c?? l???i x???y ra khi ????ng xu???t, vui l??ng th??? l???i');
    }
  };

  showDialog = (isShow) => {
    this.setState({ isShowDialog: isShow });
  };

  onPressChiTietNguoiDung = () => { };

  reRender = () => {
    this.setState((prevState) => ({
      reRender: (prevState.reRender = !this.state.reRender),
    }));
  };

  render() {
    return (
      <Root>
        <View style={{ flex: 1 }}>
          <Offcanvas3dMenu
            permission={this.dataLogin.permission}
            active={this.state.menuOpen}
            onMenuPress={this.handleMenu}
            backgroundColor={'#2e5cb8'}
            menuTextStyles={{ color: 'white' }}
            handleBackPress={true}
            viewHead={
              <View
                style={{
                  width: (Dimensions.get('window').width * 3) / 4 - 25,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  position: 'relative',
                  paddingVertical: 20,
                  flexDirection: 'row',
                }}>
                <Image
                  source={{ uri: this.dataLogin.avatar }}
                  style={[
                    {
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                    },
                    { marginLeft: 12 },
                  ]}
                />

                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      color: 'white',
                      marginTop: 12,
                      paddingHorizontal: 12,
                    }}>
                    {'T??n: '}
                    <Text
                      style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}
                      numberOfLines={2}
                      ellipsizeMode={'tail'}>
                      {this.dataLogin.name}
                    </Text>
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      color: 'white',
                      paddingHorizontal: 12,
                    }}>
                    {'Ch???c v???: ' + this.dataLogin.role}
                  </Text>
                  <Text
                    style={{
                      fontSize: 8,
                      color: 'white',
                      paddingHorizontal: 12,
                    }}>
                    {'Phi??n b???n: ' + configs.VERSION_APP}
                  </Text>

                  <TouchableOpacity style={{}} onPress={this.showDialog}>
                    <Text
                      style={{
                        color: '#66ff33',
                        fontSize: 10,
                        fontStyle: 'italic',
                        marginLeft: 12,
                      }}>
                      {'Chi ti???t ng?????i d??ng >>>'}
                    </Text>
                  </TouchableOpacity>
                  {/* {!this.adminPermission && this.dataLogin.permission === 1 && <Text style={{ color: 'red', fontSize: 10, fontStyle: 'italic', marginLeft: 12 }}>{'Ch?? ??: b???n ??ang ??? ch??? ????? admin'}</Text>} */}
                </View>
              </View>
            }
            menuItems={[
              {
                title: 'Checkin camera AI',
                icon: <IconView name="verified" size={18} color="#ffffff" />,
                renderScene: (
                  <CheckInScreen
                    navigation={this.props.navigation}
                    handleMenu={this.handleMenu}
                  />
                ),
              },
              {
                title: 'Th??ng tin ng?????i d??ng',
                icon: (
                  <IconView
                    name="user-profile-edit"
                    size={18}
                    color="#ffffff"
                  />
                ),
                renderScene: (
                  <ThongTinNguoiDungScreen
                    navigation={this.props.navigation}
                    handleMenu={this.handleMenu}
                  />
                ),
              },
              {
                title: 'Phi???u y??u c???u',
                icon: <IconView name="parcel-edit" size={18} color="#ffffff" />,
                renderScene: (
                  <XinPhepScreen
                    navigation={this.props.navigation}
                    handleMenu={this.handleMenu}
                  />
                ),
              },
              {
                title: 'Qu???n l?? ????n t???',
                icon: (
                  <IconView name="customer-check" size={18} color="#ffffff" />
                ),
                renderScene: (
                  <HistoryXinPhepScreen
                    navigation={this.props.navigation}
                    handleMenu={this.handleMenu}
                    isFromHome={true}
                  />
                ),
              },
              {
                title: 'B??o c??o t???ng quan',
                icon: (
                  <IconView name="data-transfer" size={18} color="#ffffff" />
                ),
                renderScene: <BaoCaoScreen handleMenu={this.handleMenu} />,
              },
              {
                title: 'B??o c??o chi ti???t',
                icon: (
                  <IconView name="customer-info" size={18} color="#ffffff" />
                ),
                renderScene: <LocBaoCaoScreen handleMenu={this.handleMenu} />,
              },
              // C???M XO?? _______________________________________
              // {
              //     title: 'Th??ng b??o',
              //     icon: <IconView name="alarm-normal" size={18} color='#ffffff' />,
              //     renderScene: <ThongBaoScreen
              //         handleMenu={this.handleMenu} />
              // },
              {
                title: '?????i m???t kh???u',
                icon: (
                  <IconView name="password-login" size={18} color="#ffffff" />
                ),
                renderScene: (
                  <DoiMatKhauScreen
                    navigation={this.props.navigation}
                    handleMenu={this.handleMenu}
                  />
                ),
              },
              {
                title: 'C??i ?????t chung',
                icon: (
                  <IconView name="change-people" size={18} color="#ffffff" />
                ),
                renderScene: (
                  <SettingScreen
                    navigation={this.props.navigation}
                    handleMenu={this.handleMenu}
                  />
                ),
              },
              {
                title: '????ng xu???t',
                icon: <IconView name="logout" size={18} color="#ffffff" />,
                renderScene: <CheckInScreen handleMenu={this.handleMenu} />,
              },
            ]}
          />

          <DialogChiTietNguoiDung
            isShowDialog={this.state.isShowDialog}
            showDialog={this.showDialog}
            data={this.dataLogin}
          />
        </View>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  styleTitle: {
    fontSize: configs.fontSize14_5,
    fontFamily: 'Lato-Regular',
    color: 'black',
  },
  styleTitleToolbarBase: {
    color: 'white',
    fontSize: 18,
  },
  styleViewIconLeftBase: {
    position: 'absolute',
    padding: configs.padding,
    height: '100%',
    width: configs.heightToolBar,
    justifyContent: 'center',
    alignItems: 'flex-start',
    left: configs.marginLeft10,
  },
});

const mapStateToProps = (state) => ({
  LoginReducer: state.LoginReducer,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getLogout: (params) => {
      api.getLogout(dispatch);
    },
    updateLocation: (params) => {
      api.updateLocation(dispatch, params);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TrangChuScreen);
