import React from 'react';
import { commonsConfigs as configs } from '../../../../commons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import {
  BaseComponent,
  InputView,
  DialogSelectItemFromList,
} from '../../../components';
import { connect } from 'react-redux';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { models } from '../../../../commons/model';
import { actions } from '../../../../commons/action';
import { api } from '../../../../commons/api/Api';
import Toast from 'react-native-simple-toast';

const ListLoaiXin = [
  {
    id: 1,
    title: 'Xin đi muộn',
    value: 1,
  },
  {
    id: 2,
    title: 'Xin về sớm',
    value: 2,
  },
];
class XinDiMuonVeSomScreen extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkNgayNghiDate: 0,
      isShowPickerDate: false,
      isShowDialog: false,
      reRender: false,
    };
    this.toTime = '';
    this.toDate = '';
    this.dateNgayNghi = '';
    this.indexPickerDate = 0;
    this.ishowInputView = false
    this.dataSeleLoaiNghi = {};
    this.dataSeleLoaiXin = ListLoaiXin[0];
    this.dataLogin = models.getDataLogin();

    this.handleSelectedPickerDate = this.handleSelectedPickerDate.bind(this);
    this.showPickerDate = this.showPickerDate.bind(this);
    this.showDialogChonItemFromList = this.showDialogChonItemFromList.bind(
      this,
    );
    this.setValueTextInput = this.setValueTextInput.bind(this);
    this.setGuiYeuCau = this.setGuiYeuCau.bind(this);
    this.getListBlookCa = this.getListBlookCa.bind(this)
  }

  getListBlookCa = (params) => {
    this.props.getListBlookCa(params);
  }

  handleSelectedPickerDate = (date) => {
    let valueDate = configs.convertTimeDate(date, configs.FORMAT_HH_MM_DATE_VN);
    if (this.indexPickerDate === 2) {
      this.toTime = date;
    } else if (this.indexPickerDate === 1) {
      this.toDate = date;
      this.fromDate = date
      let dateStart = (this.fromDate && configs.convertTimeDate(this.fromDate, configs.FORMAT_DATE) || "")
      let dateEnd = (this.fromDate && configs.convertTimeDate(this.fromDate, configs.FORMAT_DATE) || "")
      let params = {
        date_start: dateStart,
        date_end: dateEnd,
      }
      this.getListBlookCa(params)
    }
    this.showPickerDate(this.indexPickerDate, false);
  };

  showPickerDate = (indexPickerDate, isShow = true) => {
    this.indexPickerDate = indexPickerDate;
    if (this.indexPickerDate == 1) {
      this.ishowInputView = true
      this.toTime = ''
    }
    this.setState((state) => ({
      isShowPickerDate: (state.isShowPickerDate = isShow),
    }));
  };

  showDialogChonItemFromList(isShow, dataDialog) {
    if (isShow) {
      this.dataDialogChonItemFromList = dataDialog;
    }
    this.setState({
      isShowDialog: isShow,
    });
  }

  setValueTextInput = (id, data) => {
    if (id === 3) {
      this.textSelectLoaiNghi = data;
    } else if (id === 4) {
      this.textLyDo = data;
    } else if (id === '1') {
      this.dataSeleLoaiXin = data;
    }

    this.reRender();
  };

  setGuiYeuCau() {
    if (this.dataSeleLoaiXin.length === 0) {
      configs.showAlert('Bạn cần chọn loại xin');
    } else if (!this.toDate || this.toDate === '') {
      configs.showAlert('Bạn cần chọn ngày xin');
    } else if (!this.toTime || this.toTime === '') {
      configs.showAlert('Bạn cần chọn giờ xin');
    } else if (
      !this.textSelectLoaiNghi ||
      this.textSelectLoaiNghi.trim() === ''
    ) {
      configs.showAlert('Bạn cần nhập lý do');
    } else if (!this.textLyDo || this.textLyDo.trim() === '') {
      configs.showAlert('Bạn cần nhập lý do nghỉ');
    } else {
      this.props.listBlockCa.detail.filter(element => {
        if (element[0].length == 0) {
          Toast.show("Ngày bạn chọn là ngày nghỉ, Vui lòng chọn lại ngày", 3000)
        }
        else {
          for (i = 0; i < element[0].length; i++) {
            var settime = configs.convertTimeDate(this.toTime, configs.FORMAT_HH_MM_SS)
            var settimeStart = configs.quyDoiTimeStampToTime(element[0][i].time_start, configs.FORMAT_HH_MM_SS)
            var settimeEnd = configs.quyDoiTimeStampToTime(element[0][i].time_end, configs.FORMAT_HH_MM_SS)
            if (settimeStart < settime && settimeEnd > settime) {
              let params = {
                content: this.textLyDo,
                date: configs.convertTimeDate(this.toDate, configs.FORMAT_DATE),
                time: settime,
                title: this.textSelectLoaiNghi,
                type: this.dataSeleLoaiXin.value,
                typeOrder: 3,
              };
              this.props.createActions(params);
            }
          }
          Toast.show("Thời gian của bạn không nằm trong ca làm việc, xin vui lòng chọn lại", 3000)
        }
      });
    }
  }

  reRender = () => {
    this.setState((prevState) => ({
      reRender: (prevState.reRender = !this.state.reRender),
    }));
  };

  render() {

    let toDateDisplay =
      (this.toDate &&
        configs.convertTimeDate(this.toDate, configs.FORMAT_DATE_VN)) ||
      '';
    let dateShow =
      this.indexPickerDate === 1
        ? this.fromDate
        : this.indexPickerDate === 2
          ? this.toDate
          : this.dateNgayNghi;
    return (
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 12,
            marginTop: 12,
            paddingBottom: 50,
          }}
          showsVerticalScrollIndicator={false}>
          <Text
            style={[
              styles.styleTitle,
              { color: 'black', fontWeight: 'bold', fontSize: 18 },
            ]}>
            {'Thời gian'}
          </Text>
          <Text style={[styles.styleTitle, { color: 'black', fontSize: 13 }]}>
            {'Chọn thời gian bạn đi muộn hay về sớm'}
          </Text>
          <View
            style={
              {
                // flexDirection: 'row',
              }
            }>
            <InputView
              id={1}
              isCleared
              editable={false}
              style={[styles.styleInput]}
              styleTextInputElement={styles.styleTextInputElement}
              placeholder={'Chọn loại xin ...'}
              value={this.dataSeleLoaiXin.title}
              blurOnSubmit={true}
              iconLeft={'parcel_locate'}
              textTitle={'Chọn loại xin: '}
              onChangeText={this.setValueTextInput}
              onPressText={() => {
                let params = {
                  title: 'Chọn loại xin',
                  id: '1',
                  itemSelect: this.dataSeleLoaiXin
                    ? this.dataSeleLoaiXin.id
                    : null,
                  dataList: ListLoaiXin,
                };
                this.showDialogChonItemFromList(true, params);
              }}
            />

            <View style={{ flexDirection: 'row' }}>
              <InputView
                id={2}
                isCleared
                editable={false}
                onPressText={(id, value) => {
                  this.showPickerDate(1, true);
                }}
                multiline
                style={[styles.styleInput, { flex: 3, marginTop: configs.margin10 }]}
                styleTextInputElement={[styles.styleTextInputElement, {}]}
                styleInput={{}}
                placeholder={'Ngày xin...'}
                value={toDateDisplay}
                iconLeft={'calendar'}
                textTitle={'Ngày xin: '}
                onChangeText={(id, value) => {
                  if (value === '') {
                    this.toDate = '';
                  }
                }}
              />
              {this.ishowInputView ?
                <InputView
                  id={2}
                  isCleared
                  editable={false}
                  onPressText={(id, value) => {
                    this.showPickerDate(2, true);
                  }}
                  multiline
                  style={[styles.styleInput, { flex: 2, paddingLeft: 8 }]}
                  styleTextInputElement={[styles.styleTextInputElement, {}]}
                  styleInput={{}}
                  placeholder={
                    this.dataSeleLoaiXin.id === 1
                      ? 'Giờ xin đến'
                      : 'Giờ xin đi về'
                  }
                  value={
                    this.toTime
                      ? configs.convertTimeDate(this.toTime, configs.FORMAT_HH_MM)
                      : ''
                  }
                  iconLeft={'calendar'}
                  textTitle={
                    this.dataSeleLoaiXin.id === 1
                      ? 'Giờ xin đến'
                      : 'Giờ xin đi về'
                  }
                  onChangeText={(id, value) => {
                    if (value === '') {
                      this.toTime = '';
                    }
                  }}
                /> : null
              }
            </View>
          </View>
          {/* } */}

          <View
            style={{
              height: 0.5,
              width: '100%',
              borderColor: configs.colorBorder,
              borderWidth: 0.5,
              marginVertical: 12,
            }}
          />
          <Text
            style={[
              styles.styleTitle,
              { color: 'black', fontWeight: 'bold', fontSize: 18 },
            ]}>
            {'Lý do'}
          </Text>
          <Text style={[styles.styleTitle, { color: 'black', fontSize: 13 }]}>
            {'Nhập lý do bạn đi muộn hay về sớm'}
          </Text>

          <InputView
            id={3}
            isCleared
            style={[styles.styleInput]}
            styleTextInputElement={styles.styleTextInputElement}
            placeholder={'Nhập lý do nghỉ ...'}
            value={this.textSelectLoaiNghi}
            blurOnSubmit={true}
            iconLeft={'parcel_locate'}
            textTitle={'Tiêu đề nghỉ: '}
            onChangeText={this.setValueTextInput}
          />

          <InputView
            id={4}
            isCleared
            style={[styles.styleInput]}
            styleTextInputElement={[
              styles.styleTextInputElement,
              {
                height: 100,
              },
            ]}
            placeholder={'Nhập lý do nghỉ ...'}
            value={this.textLyDo}
            blurOnSubmit={true}
            iconLeft={'parcel-edit'}
            textTitle={'Lý do nghỉ: '}
            onChangeText={this.setValueTextInput}
            multiline
          />
        </KeyboardAwareScrollView>

        <View style={{ height: 65, justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={this.setGuiYeuCau}
            style={{
              // <TouchableOpacity onPress={() => { this.findCoordinates() }} style={{
              backgroundColor: configs.colorMain,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 8,
              shadowRadius: 8,
              shadowOffset: {
                width: 0,
                height: 3
              },
              shadowOpacity: 0.6,
              shadowColor: '#000',
              elevation: 3,
              height: 48,
              marginHorizontal: 12,
            }}>
            <Text
              style={[
                styles.styleTitle,
                { color: 'white', fontWeight: 'bold', fontSize: 18 },
              ]}>
              {'Gửi yêu cầu'}
            </Text>
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={this.state.isShowPickerDate}
          mode={this.indexPickerDate === 2 ? 'time' : 'date'}
          locale={'vi'}
          date={dateShow ? new Date(dateShow) : new Date()}
          confirmTextIOS="Thay Đổi"
          cancelTextIOS="Hủy"
          titleIOS={this.indexPickerDate === 1 ? 'Chọn ngày' : 'Chọn giờ'}
          onConfirm={this.handleSelectedPickerDate}
          onCancel={() => this.showPickerDate(this.indexPickerDate, false)}
        />

        <DialogSelectItemFromList
          isShowDialog={this.state.isShowDialog}
          dataDialog={this.dataDialogChonItemFromList}
          showDialog={this.showDialogChonItemFromList}
          onDataSelectItem={this.setValueTextInput}
        />
      </View>
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
  styleInput: {
    marginTop: configs.margin10,
  },
  styleTextInputElement: {
    flexDirection: 'row',
    height: configs.heightInput40,
    borderColor: configs.colorTitleCard,
    // borderColor: configs.colorBorder,
    borderWidth: 0.5,
    borderRadius: 8,
  },
  tabBarStyle: {
    backgroundColor: configs.colorMain,
    borderTopColor: configs.colorDivide,
    width: '100%',
    borderTopWidth: 0,
    paddingLeft: 5,
    marginTop: 0,
  },
});

const mapStateToProps = ({ OrderReducer: { listBlockCa } }) => ({
  listBlockCa,
});

const mapDispatchToProps = (dispatch) => {
  return {
    showLoadding: () => {
      dispatch(actions.showLoading());
    },
    getListBlookCa: (params) => {
      api.getListBlookCa(dispatch, params)
    },
    hideLoadding: () => {
      dispatch(actions.hideLoading());
    },
    pushNotifiToAdmin: (params) => {
      api.pushNotifiToAdminDiMuonVeSom(dispatch, params);
    },
    createActions: (params) => {
      api.createActions(dispatch, params);
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(XinDiMuonVeSomScreen);
