import React, {PureComponent} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {StackActions, NavigationActions} from 'react-navigation';
import {models} from '../../../commons/model';
import {api} from '../../../commons/api/Api';
import {actions} from '../../../commons/action';
import ReactNativeAN from 'react-native-alarm-notification';
import {commonsConfigs} from '../../../commons';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-simple-toast';
import Root from '../../components/Root';
import Popup from '../../components/Dialog';
import {duration} from 'moment';
import { login } from '../../../commons/api/instanceService'

var fcmUnsubscribe = null;
const {height} = Dimensions.get('screen');
const height_logo = height * 0.28;

class SplashScreen extends PureComponent {
  _subscribeOpen;
  _subscribeDismiss;

  constructor(props) {
    super(props);
    this.isSave = models.getDataLogin().isSavePass;
    this.dataLogin = models.getDataLogin();
    this.state = {
      isShow: this.dataLogin.isSavePass,
      fireDate: ReactNativeAN.parseDate(new Date(Date.now())),
      update: [],
      futureFireDate: '1',
      alarmId: null,
    };
    this.alert = 0;
    this.adminPermission = models.getStatusAdmin();
  }

  forwardToPage(mess) {
    // Navigate screen base on type of notification
    switch (mess) {
      case 'request_action':
        this.props.navigation.navigate('DuyetDiMuonVeSomScreen');
        return; // terminate the method here
      case 'request_sabbatical':
        this.props.navigation.navigate('DuyetNghiPhepScreen');
        return;
      case 'request_misscheckin':
        this.props.navigation.navigate('DuyetQuenChamCongScreen');
        return;
      case 'request_business':
        this.props.navigation.navigate('DuyetDiCongTacScreen');
        return;
      case 'paid_leave':
        this.props.navigation.navigate('HistoryXinPhepScreen');
        return;
      case 'sabbatical':
        this.props.navigation.navigate('HistoryXinPhepScreen');
        return;
      case 'bussiness':
        this.props.navigation.navigate('HistoryXinPhepScreen');
        return;
      case 'misscheckin':
        this.props.navigation.navigate('HistoryXinPhepScreen');
        return;
      case 'overtime':
        this.props.navigation.navigate('HistoryXinPhepScreen');
        return;
      default:
        console.log('[SplashScreen] Notification not include TYPE');
        break;
    }
  }

  // 20200626 JustCode: FCM implementation
  processNotification(remoteMessage, fromBackground) {
    let title = '';
    let body = '';
    let data = remoteMessage.data;
    if (remoteMessage) {
      if (remoteMessage.data) {
        title = data.title ?? '';
        body = data.message ?? '';
      }

      if (!fromBackground) {
        // Notification arrive while the app is running in foreground
        Toast.showWithGravity(`Thông báo\n${body}`, Toast.LONG, Toast.TOP);
      } else {
        // Notification arrive while the app is background
        this.forwardToPage(data.type);
      }
    }
  }

  componentDidUnMount() {
    console.log('fcmUnsubscribe');
    fcmUnsubscribe && fcmUnsubscribe();
  }

  async componentDidMount() {
    let res = await login({})
                    .then(res => res)
                    .catch(e => {
                      if (e) {
                        if (models.deleteAllData()) {
                          this.props.navigation.dispatch(
                            StackActions.reset({
                              index: 0,
                              key: null,
                              actions: [NavigationActions.navigate({ routeName: 'LoginScreen' })],
                            }),
                          );
                        }                      

                      }
                    })
    let checkImage;

    if (res) {
      checkImage = res.data?.["0"]?.image_sample;
      console.log("---->image", checkImage)

    }


    // console.log('DidMount Splash: ', this.dataLogin);
    this.props.apiCheckVersion();

    // Check validate Application version
    if (this.props.SplashReducer.isCheckVersion) {
      commonsConfigs.showAlert(
        commonsConfigs.NAME_APP,
        'Vui lòng cập nhật phiên bản mới nhất của ứng dụng',
        Platform.OS == 'ios'
          ? commonsConfigs.jumpToAppStore
          : commonsConfigs.jumToGoogleStore,
      );
    }

    // Check login previously
    let accessToken = models.getToken();
    // console.log('token', accessToken);
    if (accessToken && accessToken !== '') {
      let params = {
        isSavePass: true,
      };
      // console.log('re-login');
      this.props.login(params);
      // console.log('image_sample', this.dataLogin.image_sample);

      // let checkImage = false;
      // console.log("-----+++", res.data?.["0"]);
      if (!this.dataLogin.image_sample || this.dataLogin.image_sample == '' || !checkImage) {
        // console.log('Chưa cập nhật ảnh face id');
        this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            key: null,
            actions: [
              NavigationActions.navigate({routeName: 'ChenImageScreen'}),
            ],
          }),
        );
      } else {
        // console.log('đã có ảnh, check permission');
        if (this.dataLogin.permission === 1) {
          console.log(':this.adminPermission:   ', this.adminPermission);
          if (!this.adminPermission) {
            this.props.navigation.dispatch(
              StackActions.reset({
                index: 0,
                key: null,
                actions: [
                  NavigationActions.navigate({routeName: 'HomeAdminScreen'}),
                ],
              }),
            );
          } else {
            this.props.navigation.dispatch(
              StackActions.reset({
                index: 0,
                key: null,
                actions: [
                  NavigationActions.navigate({routeName: 'TrangChuScreen'}),
                ],
              }),
            );
          }
        } else {
          this.props.navigation.dispatch(
            StackActions.reset({
              index: 0,
              key: null,
              actions: [
                NavigationActions.navigate({routeName: 'TrangChuScreen'}),
              ],
            }),
          );
        }
      }
    } else {
      console.log('HAVEN"T LOGIN YET');
      this.props.navigation.dispatch(
        StackActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({routeName: 'LoginScreen'})],
        }),
      );
    }

    // 20200626 JustCode: FCM implementation
    messaging()
      .requestPermission()
      .then((authStatus) => {
        // console.log('APN Status:', authStatus);

        if (
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL
        ) {
          messaging()
            .getToken()
            .then((token) => {
              // console.log('messaging.getToken: ', token);
              if (models.getTokenModel() !== token) {
                console.log('Save to local DB');
                models.insertOrUpdateTokenDevice(
                  {
                    id: 0,
                    token_device: token,
                  },
                  true,
                );
              }
            });

          messaging().onTokenRefresh((token) => {
            console.log('messaging.onTokenRefresh: ', token);
          });

          messaging()
            .subscribeToTopic('dailyword')
            .then(() => console.log('Subscribed to topic - dailyword!'));

          messaging()
            .subscribeToTopic('version_upgrade')
            .then(() => console.log('Subscribed to topic - version_upgrade!'));

          fcmUnsubscribe = messaging().onMessage(async (remoteMessage) => {
            console.log('A new FCM message arrived!', remoteMessage);
            /// Pending show alert when user using App
            this.processNotification(remoteMessage, false);
          });

          messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log(
              'Notification caused app to open from background state:',
              remoteMessage,
            );
            this.processNotification(remoteMessage, true);
          });

          messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
              if (remoteMessage) {
                console.log(
                  'Notification caused app to open from quit state:',
                  remoteMessage,
                );
                this.processNotification(remoteMessage, true);
              }
            });
        } else {
          console.log('requestPermission Denied');
        }
      })
      .catch((err) => {
        console.log('messaging.requestPermission Error: ', err);
      });
  }

  backPressed = () => {
    return true;
  };

  showPermissions = () => {
    ReactNativeAN.checkPermissions((permissions) => {
      console.log(permissions);
    });
  };

  viewAlarms = async () => {
    const list = await ReactNativeAN.getScheduledAlarms();

    console.log(list);
    const update = list.map((l) => ({
      date: `alarm: ${l.day}-${l.month}-${l.year} ${l.hour}:${l.minute}:${l.second}`,
      id: l.id,
    }));

    this.setState({update});
  };

  deleteAlarm = async () => {
    const {alarmId} = this.state;
    if (alarmId !== '') {
      console.log(`delete alarm: ${alarmId}`);

      const id = parseInt(alarmId, 10);
      ReactNativeAN.deleteAlarm(id);
      this.setState({alarmId: ''});

      ToastAndroid.show('Alarm deleted!', ToastAndroid.SHORT);

      await this.viewAlarms();
    }
  };

  render() {
    return (
      <LinearGradient
        colors={['#4788d1', '#2e6eb8', '#24568f']}
        start={{x: 0, y: 0.25}}
        end={{x: 0.5, y: 1}}
        // locations={[0, 0.1, 0.5]}

        style={[
          styles.container,
          {
            flex: 1,
          },
        ]}>
        <StatusBar backgroundColor="#2e6eb8" barStyle="light-content" />
        <View style={styles.header}>
          <Animatable.Image
            animation="bounceIn"
            duraton="1500"
            source={require('../../../assets/image/logo.png')}
            style={styles.logo}
            resizeMode="stretch"
          />
        </View>
        {!this.state.isShow && (
          <Animatable.View
            style={[
              styles.footer,
              {
                backgroundColor: 'white',
              },
            ]}
            animation="fadeInUpBig">
            <Text
              style={[
                styles.title,
                {
                  color: 'black',
                },
              ]}>
              {'Chào mừng bạn đến với AChamCong'}
            </Text>
            <Text style={styles.text}>{'Vui lòng đăng nhập tài khoản'}</Text>
            <View style={styles.button}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('LoginScreen');
                }}>
                <LinearGradient
                  colors={['#4788d1', '#2e6eb8', '#24568f']}
                  style={styles.signIn}>
                  <Text style={styles.textSign}>{'Đăng nhập >>>'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        )}
      </LinearGradient>
    );
  }
}

const mapStateToProps = (state) => ({
  SplashReducer: state.SplashReducer,
});

const mapDispatchToProps = (dispatch) => {
  return {
    apiGetCountImageAndCheckVersion: () => {
      api.apiGetCountImageAndCheckVersion(dispatch);
    },
    apiCheckVersion: () => {
      api.apiCheckVersion(dispatch);
    },
    resetCountImage: () => {
      dispatch(
        actions.requestCountImage({
          countImage: null,
          messageCheckVersion: '',
          isCheckVersion: false,
        }),
      );
    },
    login: (params) => {
      api.setUpLogin(dispatch, params);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#009387'
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  logo: {
    width: height_logo,
    height: height_logo,
  },
  title: {
    color: '#05375a',
    fontSize: 30,
    fontWeight: 'bold',
  },
  text: {
    color: 'grey',
    marginTop: 5,
  },
  button: {
    alignItems: 'flex-end',
    marginTop: 30,
  },
  signIn: {
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
  },
  textSign: {
    color: 'white',
    fontWeight: 'bold',
  },
});
