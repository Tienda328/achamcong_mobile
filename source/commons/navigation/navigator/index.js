import React, {Component, createRef} from 'react';
import {Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {NavigationContainer} from '@react-navigation/native';

import {Provider} from 'react-redux';
import redux from '../../config/redux';
import LoadingView from '../../../ui/components/LoadingView';
import LoginScreen from '../../../ui/screens/LoginScreen/index';
import SplashScreen from '../../../ui/screens/SplashScreen/index';
import TrangChuScreen from '../../../ui/screens/TrangChuScreen/index';
import ChamCongScreen from '../../../ui/screens/ChamCongScreen/index';
import ChenImageScreen from '../../../ui/screens/ChenImageScreen/index';
import AddImageScreen from '../../../ui/screens/ChenImageScreen/AddImageScreen';
import LocBaoCaoScreen from '../../../ui/screens/LocBaoCaoScreen/index';
import ThemHinhAnhScreen from '../../../ui/screens/ChenImageScreen/index';
import DetailNghiPhepScreen from '../../../ui/screens/DuyetNghiPhepScreen/component/DetailNghiPhepScreen';
import SplashAlarmScreen from '../../../ui/screens/SplashScreen/indexAlarm';
import IntroAppScreen from '../../../ui/screens/IntroAppScreen/index';
import SettingScreen from '../../../ui/screens/SettingScreen/index';
import DuyetDetailAllScreen from '../../../ui/screens/DuyetDetailAllScreen/index';
import FaceIdScreen from '../../../ui/screens/FaceIdScreen/index';
import TimekeepingDayScreen from '../../../ui/screens/ChartStatisticalScreen/Component/TimekeepingDayScreen';
import HomeAdminScreen from '../../../ui/screens/HomeAdminScreen/index';
import ListMapCheckin from '../../../ui/screens/ChartStatisticalScreen/Component/ListMapCheckin';

import DuyetNghiPhepScreen from '../../../ui/screens/DuyetNghiPhepScreen/index';
import DuyetDiMuonVeSomScreen from '../../../ui/screens/DuyetDiMuonVeSom/index';
import DuyetChangeShiftScreen from '../../../ui/screens/DuyetChangeShiftScreen/index';
import DuyetQuenChamCongScreen from '../../../ui/screens/DuyetQuenChamCongScreen/index';
import ThongTinNguoiDungScreen from '../../../ui/screens/ThongTinNguoiDungScreen/index';
import DuyetDiCongTacScreen from '../../../ui/screens/DuyetDiCongTacScreen/index';
import ThongBaoScreen from '../../../ui/screens/ThongBaoScreen/index';
import DoiMatKhauScreen from '../../../ui/screens/DoiMatKhauScreen/index';
import IndexHome from '../../../ui/screens/LoginScreen/indexHome';
import DangKyTraiNghiem from '../../../ui/screens/LoginScreen/DangKyTraiNghiem';
import HistoryXinPhepScreen from '../../../ui/screens/HistoryXinPhepScreen';
import CameraHanetScreen from '../../../ui/screens/CameraHanetScreen/index';

import {models} from '../../../commons/model';
import * as schema from '../../../commons/model/entity/Schema';

const navigationRef = createRef();

let isIntroApp = models.getIntroAppSetting({id: schema.ID_INTRO_APP_SETTING});
// console.log('isIntroApp:    ' + JSON.stringify(isIntroApp));
isIntroApp = isIntroApp.content ? isIntroApp.content === '1' : false;
// console.log('isIntroApp1:    ' + JSON.stringify(isIntroApp));
const initiaScreen = isIntroApp ? 'SplashScreen' : 'IntroAppScreen';

const MainNavigator = createStackNavigator(
  {
    LoginScreen: {screen: LoginScreen},
    SplashScreen: {screen: SplashScreen},
    TrangChuScreen: {screen: TrangChuScreen},
    ChamCongScreen: {screen: ChamCongScreen},
    ChenImageScreen: {screen: ChenImageScreen},
    LocBaoCaoScreen: {screen: LocBaoCaoScreen},
    ThemHinhAnhScreen: {screen: ThemHinhAnhScreen},
    DetailNghiPhepScreen: {screen: DetailNghiPhepScreen},
    SplashAlarmScreen: {screen: SplashAlarmScreen},
    IntroAppScreen: {screen: IntroAppScreen},
    SettingScreen: {screen: SettingScreen},
    DuyetDetailAllScreen: {screen: DuyetDetailAllScreen},
    FaceIdScreen: {screen: FaceIdScreen},
    TimekeepingDayScreen: {screen: TimekeepingDayScreen},
    HomeAdminScreen: {screen: HomeAdminScreen},
    AddImageScreen: {screen: AddImageScreen},
    ListMapCheckin: {screen: ListMapCheckin},

    DuyetNghiPhepScreen: {screen: DuyetNghiPhepScreen},
    DuyetDiMuonVeSomScreen: {screen: DuyetDiMuonVeSomScreen},
    DuyetChangeShiftScreen: {screen: DuyetChangeShiftScreen},
    DuyetQuenChamCongScreen: {screen: DuyetQuenChamCongScreen},
    DuyetDiCongTacScreen: {screen: DuyetDiCongTacScreen},
    ThongTinNguoiDungScreen: {screen: ThongTinNguoiDungScreen},
    ThongBaoScreen: {screen: ThongBaoScreen},
    DoiMatKhauScreen: {screen: DoiMatKhauScreen},
    CameraHanetScreen: {screen: CameraHanetScreen},
    IndexHome: {screen: IndexHome},
    HistoryXinPhepScreen: {screen: HistoryXinPhepScreen},
    DangKyTraiNghiem: {screen: DangKyTraiNghiem},
  },
  {
    initialRouteName: initiaScreen,
    mode: 'modal',
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
);

var fcmUnsubscribe = null;

const AppContainer = createAppContainer(MainNavigator);

export default class App extends Component {
  render() {
    return (
      <Provider store={redux.store}>
        <NavigationContainer ref={navigationRef}>
          <LoadingView />
          <AppContainer />
        </NavigationContainer>
      </Provider>
    );
  }
}
