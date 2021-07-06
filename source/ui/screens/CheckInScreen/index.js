import React from 'react';
import {
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
} from 'react-native';
import {
  BaseComponent,
  BaseView,
  CardView,
  IconView,
  TextView,
} from '../../components';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../commons';
import ItemClockTime from './component/ItemClockTime';
import ItemClockCountTime from './component/ItemClockCountTime';
import { CalendarProvider, WeekCalendar } from 'react-native-calendars';
import { api } from '../../../commons/api/Api';
var Spinner = require('react-native-spinkit');
import Wave from 'react-native-waveview';
import { actions } from '../../../commons/action';
import DialogDetailDate from './component/DialogDetailDate';
import moment from 'moment';
import RNExitApp from 'react-native-exit-app';
import { models } from '../../../commons/model';
import ReactNativeBiometrics from 'react-native-biometrics';
import Toast from 'react-native-simple-toast';
import DeviceInfo from 'react-native-device-info';

import Popup from '../../components/Dialog';

import * as geolib from 'geolib';
import Geolocation from '@react-native-community/geolocation';

import getLocationNow from '../../../commons/libs/getLocation';

const icon_menu = require('../../../assets/image/icon_menu.png');
const arrow_check_in = require('../../../assets/image/arrow_check_in.png');
const arrow_check_out = require('../../../assets/image/arrow_check_out.png');
const WIDTH_SCREEN = Dimensions.get('window').width;

class CheckInScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      textTimeCheckIn: configs.timeHide,
      textTimeCheckOut: configs.timeHide,
      textTongGio: configs.timeHide,
      dataCalendar: {},
      dataTimeSetUp: {},
      textTinhTrang: '',
      isShowCheckIn: false,
      isLocation: null,
      textCheckInSoGioDiMuon: '0p',
      textCheckOutSoGioVeSom: '0p',
      textTongSoPhutMuonMonth: '0p',
      textSoCongTrenThang: '',
      isShowDialog: false,
      blocksToday: null,
      blockNow: {
        active_location: 1
      },
      dataCoordinates: {},

    };

    this.dataHistory = [];
    this.dataDialog = {};
    this.dataCoordinates = {};

    this.dataLogin = models.getDataLogin();

    this.getDataHistory = this.getDataHistory.bind(this);
    this.responsesResetData = this.responsesResetData.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.checkFaceIdChamCong = this.checkFaceIdChamCong.bind(this);
    this.onDateChanged = this.onDateChanged.bind(this);
  }

  getWeeksStartAndEndInMonth(isGetDateMonth = false) {
    // let paramsHistory = {};
    // let now = new Date();
    // let day = now.getDate();
    // let firstDate = new Date(now.getFullYear(), now.getMonth(), 1);
    // let lastDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    // let numDays = lastDate.getDate();

    // let start = 1;
    // let end = 7 - firstDate.getDay();
    // while (start <= numDays) {
    //   if (day >= start && day <= end) {
    //     paramsHistory = {
    //       date_start: configs.convertTimeDate(
    //         new Date(now.getFullYear(), now.getMonth(), start, 0, 0),
    //         configs.FORMAT_DATE,
    //       ),
    //       date_end: configs.convertTimeDate(
    //         new Date(now.getFullYear(), now.getMonth(), end + 1, 0, 0),
    //         configs.FORMAT_DATE,
    //       ),
    //     };
    //   }

    //   start = end + 1;
    //   end = end + 7;
    //   end = start === 1 && end === 8 ? 1 : end;
    //   if (end > numDays) {
    //     end = numDays;
    //   }
    // }

    let now = new Date()

    let start = now.getDate() - (now.getDay() - 1);

    let dateStart = new Date(now.getFullYear(), now.getMonth(), start);

    let dateEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let paramsHistory = {
      date_start: configs.convertTimeDate(dateStart, configs.FORMAT_DATE),
      date_end: configs.convertTimeDate(dateEnd, configs.FORMAT_DATE)
    }

    // let indexDay = moment(new Date()).day();
    // console.log("Check In Screen", paramsHistory);
    return paramsHistory;
  }

  findCoordinates(lat, long, radius) {
    // console.log("-----", this.blockNow);
    if (this.state.blockNow.active_location === 1) {
      // console.log("Get locations.....", this.state.blockNow.active_location)
      Geolocation.getCurrentPosition(
        (position) => {
          let khoangCach = geolib.getPreciseDistance(position.coords, {
            latitude: lat,
            longitude: long,
          });
          this.dataCoordinates = position.coords;

          // console.log('khoangCach:  ', JSON.stringify(khoangCach), '\n', position.coords, {lat, long});

          this.setState({
            isShowCheckIn: parseInt(khoangCach) < parseInt(radius),
            isLocation: parseInt(khoangCach) < parseInt(radius),
            dataCoordinates: position.coords
          });
        },
        (error) => {
          this.setState({
            isShowCheckIn: false,
            isLocation: false,
          });
          configs.showAlert(
            // 'Bạn chưa cấp quyền vị trí cho ứng dụng. Vui lòng vào cài đặt để thêm quyền cho ứng dụng.',
            error.message,
          );
          // console.log("Check In Screen",error);
        },
        { enableHighAccuracy: false },
      );
    } else {
      this.setState({
        isShowCheckIn: true,
        isLocation: true,
      });
    }
  }

  responsesResetData = () => {
    this.getDataHistory(false);
  };

  componentDidMount() {
    // console.log('Didmount checkIn screen');
    // this.timer = setInterval(() => {
    //   console.log('inside set interval');
    //   this.updateLocation();
    // }, 900000);
    this.deviceInfo = DeviceInfo.getModel();
    DeviceInfo.getDeviceName().then((deviceName) => {
      this.deviceInfo = DeviceInfo.getModel() + ' ' + deviceName;
    });

    this.getDataHistory(true);
    // this.getDataXinGapKhach()

  }

  componentWillUnmount() {
    // clearInterval(this.timer);
  }

  getDataXinGapKhach = async () => {
    let responses = await this.props.getDataCheckBusiness();
    // console.log('responses:    ', responses);
  };

  onDayPress(day) {
    //data = [day[block1, block2....], .....] -- all data from date to date

    let data = this.props.CheckInHomeReducer.detailBlockInDate;
    data = data && data.data.detail ? data.data.detail : [];

    // console.log({data});

    //get data onDay
    data = data.find((item) => item.date === day.dateString);

    // console.log(Date.parse(day.dateString));

    if (Date.parse(day.dateString) > Date.now()) {
      Popup.show({
        type: 'Warning',
        title: 'Thông báo',
        textBody:
          'Bạn không thể xem chi tiết ngày trong tương lai',
        button: true,
        buttonCancel: false,
        callback: () => Popup.hide(),
        callbackOk: () => Popup.hide(),
      });
      return;
    }


    //show data
    if (data && data[0].length) {
      this.dataDialog = {
        data: (data && data[0]) || [], // all block in day
        date: (data && data.date) || '',
      };
      this.showDialog(true);
    } else {
      Popup.show({
        type: 'Warning',
        title: 'Thông báo',
        textBody:
          'Đây là ngày nghỉ hoặc bạn không có ca nào trong ngày này',
        button: true,
        buttonCancel: false,
        callback: () => Popup.hide(),
        callbackOk: () => Popup.hide(),
      });
    }
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
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 120000 },
    );
  };

  showDialog = (isShow) => {
    this.setState({ isShowDialog: isShow });
  };

  getDataHistory = (isLoadLocation) => {
    this.props.requestDataHistory(
      this.getWeeksStartAndEndInMonth(),
      isLoadLocation,
    );
  };

  onDateChanged = (day) => {
    // console.log("Check In Screen", day);
    let nowDate = configs.convertTimeDate(new Date(), configs.FORMAT_DATE);

    let date_start = new Date(day);
    let endYear = date_start.getFullYear();
    let endMonth = date_start.getMonth();
    let endDay = date_start.getDate() + 6;
    let date_end = new Date(endYear, endMonth, endDay);

    let params = {
      date_start: configs.convertTimeDate(date_start, configs.FORMAT_DATE),
      date_end: configs.convertTimeDate(date_end, configs.FORMAT_DATE),
    };
    // console.log({nowDate, day});
    // console.log("------>",{params})

    if (nowDate === day) {
      this.getDataHistory();
    } else {
      this.props.requestDataHistory(params);
    }
  };

  checkFaceIdChamCong = async () => {
    const { biometryType } = await ReactNativeBiometrics.isSensorAvailable();
    if (biometryType === ReactNativeBiometrics.FaceID) {
      ReactNativeBiometrics.createSignature({
        promptMessage: 'AChamCong',
        payload: 'Ninjateam AChamCong',
      }).then((resultObject) => {
        const { success, signature } = resultObject;
        // console.log('signature:     ', signature);
        // this.setState({ isCheckFaceIdAuthentication: success })
        if (!success) {
          configs.showAlert(
            'Không xác thực được face id. Vui lòng kiểm tra lại',
          );
        } else {
          if (signature === this.dataLogin.idCheckInFaceId) {
            Toast.show('Xác thực face id thành công');
            if (
              this.state.dataCoordinates &&
              this.state.dataCoordinates.latitude &&
              this.state.dataCoordinates.longitude
            ) {
              this.props.requestChamCongFaceId({
                face_id: signature,
                device: this.deviceInfo,
                location:
                  this.state.dataCoordinates.latitude +
                  ',' +
                  this.state.dataCoordinates.longitude,
              });
            } else {
              // setTimeout(() => {
              //   this.findCoordinates();
              // }, 20000);
            }
          } else {
            Toast.show(
              'Dữ liệu face id không đúng. Vui lòng check lại face id của bạn.',
            );
          }
        }
      });
    } else {
      configs.showAlert(
        'Máy điện thoại bạn chưa cấp quyền quyền hoặc không có face id. Vui lòng tắt chế độ chấm công bằng face id',
      );
    }
  };

  async setTimeHistory(data, dataTimeSetUp, resultDataFree) {
    // NetInfo.fetch().then(state => {
    //     console.log("Connection type", state.type);
    //     console.log("Is connected?", JSON.stringify(state));
    // });

    if (data && dataTimeSetUp) {
      let weeks = {};
      let textTinhTrang = 'Chưa chấm công';
      let textTimeCheckIn = configs.timeHide;
      let textTimeCheckOut = configs.timeHide;
      let textTongGio = configs.timeHide;
      let isShowCheckIn = true;
      let textCheckInSoGioDiMuon = configs.timeHideOp;
      let textCheckOutSoGioVeSom = configs.timeHideOp;
      this.dataHistory = data;

      let timeStartCheckIn = dataTimeSetUp
        ? new Date(configs.convertTimeDate1(dataTimeSetUp.checkin))
        : '';
      let timeEndCheckIn = dataTimeSetUp
        ? new Date(configs.convertTimeDate1(dataTimeSetUp.checkout))
        : '';
      let timeNow = new Date();
      if (
        timeEndCheckIn &&
        timeStartCheckIn &&
        (timeNow.getTime() - timeEndCheckIn.getTime() >= 0 ||
          timeNow.getTime() - timeStartCheckIn.getTime() <= 0)
      ) {
        isShowCheckIn = false;
      }

      // set color calendar
      for (let i = 0; i < data.length; i++) {
        let blockDays = data[i][0];
        let date = data[i].date;
        let nowDate = Date.now();

        // console.log({
        //   date: Date.parse(date),
        //   nowDate
        // })

        if (Date.parse(date) < nowDate) {
          // tổng công nhân viên đã làm trong 1 ngày
          let shift = 0;
          // tổng công tối đa nhân viên có thể làm trong 1 ngày
          let shiftTotal = 0;
          // check trạng thái đi muộn
          let late = false;
          //check trangj thái về sớm
          let soon = false;

          let selectedColor = null;
          // let selected = true;

          for (let j = 0; j < blockDays.length; j++) {
            shift += parseFloat(blockDays[j].shift);
            shiftTotal += parseFloat(blockDays[j].shift_total);

            if (blockDays[j].late && !late) {
              late = true;
            }

            if (blockDays[j].soon && !soon) {
              soon = true;
            }
          }

          // set color day
          if (shiftTotal) {
            // Thiếu công
            if (shift < shiftTotal) {
              selectedColor = configs.colorThieuCong;
            }

            if (shift === shiftTotal) {
              selectedColor = configs.colorDuCong;
            }

            if (late) {
              selectedColor = configs.colorDiMuon;
            }

            if (soon) {
              selectedColor = configs.colorDiMuon;
            }

            // selected = true;
          }

          weeks = {
            ...weeks,
            [date]: {
              selected: true,
              selectedColor: selectedColor,
            },
          };
        }
      }

      // find block arr today
      let today = configs.convertTimeDate(new Date(), configs.FORMAT_DATE);
      let blocksToday;
      for (let i = 0; i < data.length; i++) {
        if (data[i].date === today) {
          blocksToday = data[i][0];
          break;
        }
      }

      blocksToday = blocksToday || this.state.blocksToday;
      let posBlock = 0;

      if (blocksToday) {
        let timeNow1 = Date.now() / 1000;

        // Tìm vị trí ca làm việc
        for (let i = 0; i < blocksToday.length; i++) {
          posBlock = i;
          if (timeNow1 < blocksToday[i].time_end) {
            break;
          }
        }

        if (posBlock !== 0 && timeNow1 < blocksToday[posBlock].time_start) {
          posBlock--;
        }

        this.blockNow = blocksToday[posBlock];

        // without block empty
        if (blocksToday[posBlock]) {
          //set block title
          textTinhTrang = blocksToday[posBlock].name;

          textTimeCheckIn = blocksToday[posBlock].checkin
            ? blocksToday[posBlock].checkin
            : textTimeCheckIn;
          textTimeCheckOut = blocksToday[posBlock].checkout
            ? blocksToday[posBlock].checkout
            : textTimeCheckOut;

          textCheckInSoGioDiMuon = blocksToday[posBlock].late
            ? blocksToday[posBlock].late
            : blocksToday[posBlock].checkin - blocksToday[posBlock].time_start >
              0
              ? (
                (blocksToday[posBlock].checkin -
                  blocksToday[posBlock].time_start) /
                60
              ).toFixed(1)
              : textCheckInSoGioDiMuon;

          textCheckOutSoGioVeSom = blocksToday[posBlock].soon
            ? blocksToday[posBlock].soon
            : textCheckOutSoGioVeSom;

          //formart time
          // textCheckInSoGioDiMuon = (textCheckInSoGioDiMuon/60).toFixed(1);

          // console.log({textCheckInSoGioDiMuon, textCheckOutSoGioVeSom});

          if (textTimeCheckOut !== configs.timeHide) {
            textTongGio = configs.convertTruGio1(
              textTimeCheckOut * 1000,
              textTimeCheckIn * 1000,
            );
          } else {
            textTongGio = configs.convertTruGio1(
              timeNow1 * 1000,
              blocksToday[posBlock].checkin * 1000,
            );
          }
        }
      }

      //check vi tri co hop lẹ hay khong
      if (
        dataTimeSetUp.active_location &&
        dataTimeSetUp.active_location === 1 &&
        dataTimeSetUp.isLoadLocation
      ) {
        let dataLocation = dataTimeSetUp.location.split(',');
        if (dataLocation && dataLocation[0] && dataLocation[1]) {
          // this.findCoordinates(
          //   dataLocation[0].trim(),
          //   dataLocation[1].trim(),
          //   dataTimeSetUp.radius,
          // );
        } else {
          setTimeout(() => {
            Alert.alert(
              configs.NAME_APP,
              'Không xác định được tọa độ chi nhánh. Vui lòng liên hệ lại admin để xử lý.',
              [
                {
                  text: configs.DONG_Y,
                  onPress: () => {
                    RNExitApp.exitApp();
                  },
                },
              ],
            );
          }, 700);
        }
      }
      // console.log("------->||", this.state.blockNow)

      //check location
      isShowCheckIn = false;
      let isLocation = false;
      try {

        // console.log("Check location ......", blocksToday[posBlock]?.active_location)
        if (blocksToday[posBlock]?.active_location === 1) {

          let { coords } = await getLocationNow();

          // console.log({coords})

          let dataTimeSetUp = this.props.CheckInHomeReducer.dataTimeSetUp;
          let radius = dataTimeSetUp?.radius;

          let dataLocation = dataTimeSetUp?.location.split(',');

          let khoangCach = geolib.getPreciseDistance(coords, {
            latitude: dataLocation[0].trim(),
            longitude: dataLocation[1].trim(),
          });

          // console.log({
          //   khoangCach,
          //   latitude: dataLocation[0].trim(),
          //   longitude: dataLocation[1].trim(),
          // })

          isShowCheckIn = parseInt(khoangCach) < parseInt(radius);
          isLocation = parseInt(khoangCach) < parseInt(radius);

        } else {
          isShowCheckIn = true;
          isLocation = true;
        }

        } catch (e) {
          console.log(e)
        }

        this.setState({
          isShowCheckIn: isShowCheckIn,
          isLocation: isLocation,
          blocksToday,
          blockNow: blocksToday[posBlock],
          dataCalendar: weeks,
          textTinhTrang: textTinhTrang,
          textTimeCheckIn: textTimeCheckIn,
          textTimeCheckOut: textTimeCheckOut,
          textTongGio: textTongGio,
          dataTimeSetUp: dataTimeSetUp,
          textTongSoPhutMuonMonth:
            data && data.length > 0
              ? data[data.length - 1].late_soon + 'p'
              : '--h : --p : --s',
          textSoCongTrenThang:
            (data && data.length > 0 ? data[data.length - 1].shift + '/' : '') +
            (data && data.length > 0 ? data[data.length - 1].total_shift : ''),
          textCheckInSoGioDiMuon:
            (textTimeCheckIn !== configs.timeHide && textCheckInSoGioDiMuon) ||
              textCheckInSoGioDiMuon === 0
              ? textCheckInSoGioDiMuon
              : '--h : --p : --s',
          textCheckOutSoGioVeSom:
            (textTimeCheckOut !== configs.timeHide && textCheckOutSoGioVeSom) ||
              textCheckOutSoGioVeSom === 0
              ? textCheckOutSoGioVeSom
              : '--h : --p : --s',
        });
      } else {
        configs.showAlert('Chưa lấy được dữ liệu điểm danh trong tuần');
      }
    }

    componentDidUpdate(prevProps, prevState) {
      // console.log({data: this.state.blockNow});
      if (this.props.CheckInHomeReducer) {
        if (
          this.props.CheckInHomeReducer.detailBlockInDate &&
          this.props.CheckInHomeReducer.detailBlockInDate !==
          prevProps.CheckInHomeReducer.detailBlockInDate
        ) {
          let data = this.props.CheckInHomeReducer.detailBlockInDate;
          data = data && data.data.detail ? data.data.detail : [];
          let dataTimeSetUp = this.props.CheckInHomeReducer.dataTimeSetUp;
          let resultDataFree = this.props.CheckInHomeReducer.resultDataFree;
          this.setTimeHistory(data, dataTimeSetUp, resultDataFree);
        }
      }

      if (this.props.ChamCongReducer) {
        if (
          this.props.ChamCongReducer.isChamCongFaceId &&
          this.props.ChamCongReducer.isChamCongFaceId !== ''
        ) {
          setTimeout(() => {
            Alert.alert(
              configs.NAME_APP,
              this.props.ChamCongReducer.isChamCongFaceId,
              [
                {
                  text: configs.DONG_Y,
                  onPress: () => {
                    this.props.requestDataChamCongFaceId();
                    this.responsesResetData();
                  },
                },
              ],
            );
          }, 700);
        }
      }
    }

    drawGhiChu() {
      return (
        <View
          style={{
            flexDirection: 'row',
            marginTop: 8,
            justifyContent: 'space-around',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                backgroundColor: configs.colorDiMuon,
                width: 10,
                height: 10,
                borderRadius: 5,
                marginRight: 8,
              }}
            />
            <Text>{'Đi muộn'}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                backgroundColor: configs.colorDuCong,
                width: 10,
                height: 10,
                borderRadius: 5,
                marginRight: 8,
              }}
            />
            <Text>{'Đúng giờ'}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                backgroundColor: configs.colorThieuCong,
                width: 10,
                height: 10,
                borderRadius: 5,
                marginRight: 4,
              }}
            />
            <Text>{'Không đủ công'}</Text>
          </View>
        </View>
      );
    }

    render() {
      let {
        textTimeCheckIn,
        textTimeCheckOut,
        isShowCheckIn,
        isLocation,
        dataTimeSetUp,
        textTongSoPhutMuonMonth,
        textCheckInSoGioDiMuon,
        textCheckOutSoGioVeSom,
        textSoCongTrenThang,
      } = this.state;
      let now = new Date();
      return (
        <BaseView
          stylesView={{ flex: 1, backgroundColor: 'white' }}
          titleScreen={'Kiểm tra checkin'}
          subTitle={'havantam.it@gmail.com'}
          styleToolbar={{ height: 45 }}
          isShowLogo={false}
          stylesViewTitle={{ justifyContent: 'center', alignItems: 'center' }}
          styleTitle={[{ justifyContent: 'center', alignItems: 'center', flex: 1 }]}
          styleTitleToolbarBase={styles.styleTitleToolbarBase}
          drawIconLeft={
            <TouchableOpacity
              style={[styles.styleViewIconLeftBase, { marginLeft: 12 }]}
              onPress={this.props.handleMenu}>
              <Image
                source={icon_menu}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 20,
                  height: 20,
                  tintColor: 'black',
                }}
              />
            </TouchableOpacity>
          }
          isShowIconRight={true}
          nameIconRight={'alarm-normal'}
          colorIconRight={'black'}
          fontSizeIconRight={configs.fontSize24}>
          <CalendarProvider
            // date={new Date()}
            // disabledOpacity={0.6}
            disableAllTouchEventsForDisabledDays={true}
            onDateChanged={this.onDateChanged}>
            <WeekCalendar
              // testID={'weekCalendar'}
              firstDay={1}
              hideExtraDays={true}
              markedDates={this.state.dataCalendar}
              onDayPress={(day) => this.onDayPress(day)}
            />
            <View
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
              }}>
              {this.drawGhiChu()}

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 12,
                }}>
                <TextView
                  style={[styles.styleTitle, { justifyContent: 'center' }]}
                  styleValue={
                    (styles.styleTitle,
                      { color: isLocation ? configs.colorDongY : 'red' })
                  }
                  // title={"Group ID:"}
                  value={
                    isLocation ? 'Địa điểm hợp lệ' 
                                : isLocation === null ? 'Đang lấy location...'
                                : 'Địa điểm không hợp lệ'}
                  iconLeft="map-item"
                  iconColor={isLocation ? configs.colorDongY : 'red'}
                  iconSize={configs.sizeIcon18}
                />

                <IconView
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 12,
                  }}
                  onPress={() => {
                    Alert.alert(configs.NAME_APP, 'Kiểm tra lại vị trí.', [
                      {
                        text: configs.DONG_Y,
                        onPress: () => {
                          if (dataTimeSetUp && dataTimeSetUp.location) {
                            let dataLocation = dataTimeSetUp.location.split(',');
                            // console.log({dataLocation})
                            this.findCoordinates(
                              dataLocation[0].trim(),
                              dataLocation[1].trim(),
                              dataTimeSetUp.radius,
                            );
                          }
                        },
                      },
                      {
                        text: 'Hủy',
                        onPress: () => { },
                      },
                    ]);
                  }}
                  name={'my_location'}
                  size={configs.sizeIcon18}
                  color={isLocation ? configs.colorDongY : 'red'}
                />
              </View>

              <Text
                style={[styles.styleTitle, { textAlign: 'center', fontSize: 10 }]}>
                {'Tổng số phút muộn của tháng: ' +
                  this.props.CheckInHomeReducer.detailDataMonth?.late_soon}
              </Text>
              <Text
                style={[styles.styleTitle, { textAlign: 'center', fontSize: 10 }]}>
                {'Tổng số công của tháng: ' +
                  this.props.CheckInHomeReducer.detailDataMonth?.shift +
                  '/' +
                  this.props.CheckInHomeReducer.detailDataMonth?.total_shift}
              </Text>
              <Text style={[styles.styleTitle, { textAlign: 'center' }]}>
                {'Tình trạng: '}
                <Text
                  style={{
                    color:
                      this.state.textTinhTrang === 'Chưa chấm công'
                        ? 'red'
                        : 'blue',
                  }}>
                  {this.state.textTinhTrang}
                </Text>
              </Text>

              <View style={{ alignItems: 'center', flex: 1, marginTop: 12 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 8,
                    marginTop: 20,
                  }}>
                  <View style={{ flex: 1 }}>
                    <TextView
                      style={[styles.styleTitle]}
                      styleValue={(styles.styleTitle, { color: '#66b3ff' })}
                      title={'Thời gian check in:'}
                      value={
                        textTimeCheckIn && textTimeCheckIn !== '--h : --p : --s'
                          ? configs.quyDoiTimeStampToTime(textTimeCheckIn)
                          : textTimeCheckIn
                      }
                      iconLeft="map-item"
                      iconColor={'#66b3ff'}
                      iconSize={configs.sizeIcon18}
                    />

                    <Text
                      style={[
                        styles.styleTitle,
                        {
                          fontSize: 10,
                          marginLeft: 20,
                          color:
                            !textCheckInSoGioDiMuon ||
                              textCheckInSoGioDiMuon === configs.timeHideOp
                              ? configs.colorText
                              : '#ff704d',
                        },
                      ]}>
                      {'Muộn: ' + textCheckInSoGioDiMuon + ' phút'}
                    </Text>

                    <Image
                      style={{
                        width: 20,
                        height: 20,
                        tintColor: '#66b3ff',
                        marginLeft: 20,
                      }}
                      source={arrow_check_in}
                    />
                  </View>

                  <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <TextView
                      style={[styles.styleTitle, { justifyContent: 'flex-end' }]}
                      styleValue={(styles.styleTitle, { color: '#ff704d' })}
                      title={'Thời gian check out:'}
                      value={
                        textTimeCheckOut && textTimeCheckOut !== '--h : --p : --s'
                          ? configs.quyDoiTimeStampToTime(textTimeCheckOut)
                          : textTimeCheckOut
                      }
                      iconLeft="map-item"
                      iconColor={'#ff704d'}
                      iconSize={configs.sizeIcon18}
                    />
                    <Text
                      style={[
                        styles.styleTitle,
                        {
                          fontSize: 10,
                          textAlign: 'right',
                          color:
                            !textCheckOutSoGioVeSom ||
                              textCheckOutSoGioVeSom === configs.timeHideOp
                              ? configs.colorText
                              : '#ff704d',
                        },
                      ]}>
                      {'Sớm: ' + textCheckOutSoGioVeSom + ' phút'}
                    </Text>

                    <View style={{ alignItems: 'flex-end', width: '100%' }}>
                      <Image
                        style={{
                          width: 20,
                          height: 20,
                          tintColor: '#ff704d',
                          marginRight: 20,
                        }}
                        source={arrow_check_out}
                      />
                    </View>
                  </View>
                </View>

                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <TouchableOpacity
                    disabled={!isShowCheckIn}
                    // onPress={() => { this.props.navigation.navigate('ChamCongScreen', { responsesResetData: this.responsesResetData }) }}
                    onPress={async () => {
                      if (
                        this.dataLogin.idCheckInFaceId !== '' &&
                        this.dataLogin.isCheckinFromFaceId
                      ) {
                        this.checkFaceIdChamCong();
                      } else {
                        try {
                          //required location
                          if (this.state.blockNow?.active_location) {

                            let { coords } = await getLocationNow();
                            let dataTimeSetUp = this.props.CheckInHomeReducer.dataTimeSetUp;
                            let radius = dataTimeSetUp?.radius;

                            let dataLocation = dataTimeSetUp?.location.split(',');

                            let khoangCach = geolib.getPreciseDistance(coords, {
                              latitude: dataLocation[0].trim(),
                              longitude: dataLocation[1].trim(),
                            });

                            let isShowCheckIn = parseInt(khoangCach) < parseInt(radius);
                            let isLocation = parseInt(khoangCach) < parseInt(radius);
                            // console.log("=====>", isLocation)
                            if (isLocation) {
                              this.props.navigation.navigate('FaceIdScreen', {
                                responsesResetData: this.responsesResetData,
                                dataCoordinates:
                                  // this.state.dataCoordinates || coords,
                                  coords,
                                blockNow: this.state.blockNow,
                              });
                            }

                          } else {
                            //not required
                            let { coords } = await getLocationNow();

                            this.props.navigation.navigate('FaceIdScreen', {
                              responsesResetData: this.responsesResetData,
                              dataCoordinates:
                                // this.state.dataCoordinates || coords,
                                coords,
                              blockNow: this.state.blockNow,
                            });
                          }

                        } catch (error) {
                          console.log({ error })
                        }


                      }
                    }}
                    // onPress={this.selectPhotoTapped.bind(this)}
                    style={{
                      borderWidth: 2,
                      borderColor: '#ffe6e6',
                      borderRadius: (WIDTH_SCREEN * 3) / 10 + 8,
                      elevation: 5,
                      shadowColor: '#ffb3b3',
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      shadowOffset: {
                        width: 5,
                        height: 5,
                      },
                      position: 'relative',
                    }}>
                    {isShowCheckIn && (
                      <Spinner
                        size={(WIDTH_SCREEN * 3) / 5 + 40}
                        type={'Bounce'}
                        color={'#ffcccc'}
                        style={{
                          position: 'absolute',
                          top: -20,
                          left: -20,
                        }}
                      />
                    )}

                    <LinearGradient
                      style={{
                        width: (WIDTH_SCREEN * 3) / 5,
                        height: (WIDTH_SCREEN * 3) / 5,
                        borderRadius: (WIDTH_SCREEN * 3) / 10,
                        borderWidth: 5,
                        borderColor: '#22f7e5',
                        elevation: 5,
                        shadowColor: '#000',
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                      }}
                      colors={[
                        '#22f7e5',
                        '#3af8e8',
                        '#09f6e2',
                        '#08d4c4',
                        '#059488',
                      ]}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          flex: 1,
                        }}>
                        <Text style={[styles.styleTitle, { color: 'black' }]}>
                          {'Tổng t/g làm:'}
                        </Text>
                        {/* <Text style={[styles.styleTitle, { color: 'blue', fontWeight: 'bold', fontSize: 30, marginTop: 12 }]}>{this.state.textTongGio}</Text> */}
                        <ItemClockCountTime
                          timeStart={textTimeCheckIn}
                          timeEnd={textTimeCheckOut}
                          timeTongGio={this.state.textTongGio}
                        />
                      </View>

                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          position: 'relative',
                        }}>
                        <Wave
                          style={{
                            width: (WIDTH_SCREEN * 3) / 5 - 7,
                            height: (WIDTH_SCREEN * 3) / 5,
                            // aspectRatio: 1,
                            overflow: 'hidden',
                            position: 'absolute',
                            bottom: 0,
                            borderRadius: (WIDTH_SCREEN * 3) / 10,
                          }}
                          H={(WIDTH_SCREEN * 3) / 10 - 10}
                          waveParams={[
                            // { A: 10, T: 180, fill: '#22f7e5' },
                            // { A: 15, T: 140, fill: '#08d4c4' },
                            { A: 12, T: 100, fill: '#047b71' },
                          ]}
                          animated={false}
                        />

                        <ItemClockTime
                          styleTimeText={[
                            styles.styleTitle,
                            {
                              color: 'white',
                            },
                          ]}
                        />

                        <Text
                          style={[
                            {
                              color: '#fff',
                              fontSize: 18,
                              fontWeight: 'bold',
                              marginTop: 8,
                            },
                          ]}>
                          {' '}
                          {'Chấm công '}
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{ height: 40, flexDirection: 'row', marginHorizontal: 12 }}>
                <Image
                  source={require('../../../assets/image/logodatviet.png')}
                  style={{ resizeMode: 'contain', height: 40, width: '100%' }}
                />
              </View>
            </View>
          </CalendarProvider>

          <DialogDetailDate
            isShowDialog={this.state.isShowDialog}
            showDialog={this.showDialog}
            {...this.dataDialog}
          />
        </BaseView>
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
      fontSize: 18,
    },
    styleViewIconLeftBase: {
      padding: configs.padding,
      width: configs.heightToolBar,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    signIn: {
      width: '100%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },
  });

  const mapStateToProps = (state) => ({
    CheckInHomeReducer: state.CheckInHomeReducer,
    ChamCongReducer: state.ChamCongReducer,
  });

  const mapDispatchToProps = (dispatch) => {
    return {
      requestDataHistory: (params, isLoadLocation) => {
        api.requestDataHistory(dispatch, params, isLoadLocation);
      },
      requestChamCong: (params) => {
        api.requestChamCong(dispatch, params);
      },
      requestChamCongFaceId: (params) => {
        api.requestChamCongFaceId(dispatch, params);
      },
      getDataCheckBusiness: () => {
        api.getDataCheckBusiness(dispatch);
      },
      requestDataChamCong: () => {
        dispatch(actions.requestDataChamCong(''));
      },
      requestDataChamCongFaceId: () => {
        dispatch(actions.requestDataChamCongFaceId(''));
      },
      updateLocation: (params) => {
        api.updateLocation(dispatch, params);
      },
    };
  };
  export default connect(mapStateToProps, mapDispatchToProps)(CheckInScreen);
