import React from 'react';
import {commonsConfigs as configs} from '../../../../commons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {StyleSheet, TouchableOpacity, View, Text, ToastAndroid } from 'react-native';
import {
  BaseComponent,
  InputView,
  DialogSelectItemFromList,
} from '../../../components';
import {connect} from 'react-redux';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {models} from '../../../../commons/model';
import Toast from 'react-native-simple-toast';
import {actions} from '../../../../commons/action';
import {api} from '../../../../commons/api/Api';
import { dangKyCaLamViec } from '../../../../commons/api/instanceService'

const ChangeShiftTypes = [
  {
    id: 0,
    title: '',
    value: 0,
  },
  {
    id: 1,
    title: 'Tăng ca',
    value: 1,
  },
  {
    id: 2,
    title: 'Giảm ca',
    value: 2,
  },
];

class ShiftChangeTab extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isShowPickerDate: false,
      isShowDialog: false,
      reRender: false,
    };
    this.date = new Date();
    this.start = null;
    this.end = null;
    this.startTime = '';
    this.endTime = '';
    this.shift = null;
    this.dataBlock = {};
    this.content = '';
    this.indexPickerDate = 0;
    this.indexSelectType = 0;
    this.dataChangeShift = ChangeShiftTypes[0];
    this.dataLogin = models.getDataLogin();

    this.handleSelectedPickerDate = this.handleSelectedPickerDate.bind(this);
    this.showPickerDate = this.showPickerDate.bind(this);
    this.showDialogChonItemFromList = this.showDialogChonItemFromList.bind(
      this,
    );
    this.setValueTextInput = this.setValueTextInput.bind(this);
    this.isValid = this.isValid.bind(this);
    this.setGuiYeuCau = this.setGuiYeuCau.bind(this);
    this.getListBlock = this.getListBlock.bind(this);
  }

  componentDidMount() {
    this.getListBlock();
  }

  getListBlock = () => {
    this.props.getListBlock({
      date: configs.convertTimeDate(this.date, configs.FORMAT_DATE),
    });
  };

  handleSelectedPickerDate = (date) => {
    if (this.indexPickerDate === 1) {
      // Select date
      this.date = configs.convertTimeDate(date, configs.FORMAT_DATE);
      console.log('select date', this.date);
      // Reset data after change date to change shift
      this.startTime = '';
      this.endTime = '';
      this.shift = 0;
      this.dataBlock = {};
      this.content = '';
      this.getListBlock({
        date: configs.convertTimeDate(
          configs.convertTimeDate(date, configs.FORMAT_DATE),
        ),
      });
    } else {
      if (this.indexPickerDate === 2) {
        // Select start time
        if (this.end && date > this.end) {
          Toast.show('Thời gian bắt đầu không được lớn hơn thời gian kết thúc');
          return;
        }
        this.start = date;
        this.startTime = configs.convertTimeDate(date, configs.FORMAT_HH_MM_SS);
        console.log('select start time', this.startTime);
      } else if (this.indexPickerDate === 3) {
        // Select end time
        if (this.start && this.start > date) {
          Toast.show('Thời gian bắt đầu không được lớn hơn thời gian kết thúc');
          return;
        }
        this.end = date;
        this.endTime = configs.convertTimeDate(date, configs.FORMAT_HH_MM_SS);
      }
    }

    this.showPickerDate(this.indexPickerDate, false);
  };

  showPickerDate = (indexPickerDate, isShow = true) => {
    this.indexPickerDate = indexPickerDate;
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
    console.log('data selected', data);
    if (id === 1 || id === '1') {
      // Select change shift type
      this.dataChangeShift = data;
      this.startTime = '';
      this.endTime = '';
      this.shift = 0;
    }
    if (id === 2 || id === '2') {
      // Select block
      this.dataBlock = data;
      this.shift = this.props.listBlock[data.id - 1].shift;
      this.startTime = this.props.listBlock[data.id - 1].time_start;
      this.endTime = this.props.listBlock[data.id - 1].time_end;
    }
    if (id === 3 || id === '3') {
      // Input amount of shift
      // this.shift = data;
    }
    if (id === 7 || id === '7') {
      // Input content
      this.content = data;
    }
    if (id === 8 || id === '8') {
      // Input content
      this.note = data;
    }

    this.reRender();
  };

  isValid = () => {
    if (this.shift == null) {
      // Toast.show('Số ca không thể để trống.');
      // return false;
    }
    if (this.content == '') {
      Toast.show('Bạn cần nhập lý do xin đăng ký ca.');
      return false;
    }

    return true;
  };

  async setGuiYeuCau() {
    if (this.isValid()) {
      let params = {
        date: `${configs.convertTimeDate(
            this.date,
            configs.FORMAT_DATE,
          )}`,
        // type: this.dataChangeShift.value,
        content: this.content,
        // shift: this.dataChangeShift.id == 2 ? this.shift : Number(this.shift),
        state_request: 1,
        note: this.note,
        id_member: this.dataLogin.id,
        // 'shift_ids[1]': 123,
        // 'shift_ids[0]': 18,
        shift_ids: [18, 123],
        title: "Đăng ký ca làm việc"
      };

      console.log('param create', params);
      try {
          
          let res = await dangKyCaLamViec(params);
    
          ToastAndroid.show("Đăng ký thành công", ToastAndroid.LONG);

      } catch (error) {
          ToastAndroid.show("Đăng ký thật bại", ToastAndroid.LONG);
      }
    }
  }

  reRender = () => {
    this.setState((prevState) => ({
      reRender: (prevState.reRender = !this.state.reRender),
    }));
  };

  render() {
    return (
      <View style={{flex: 1}}>
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
              {color: 'black', fontWeight: 'bold', fontSize: 18},
            ]}>
            {'Thời gian'}
          </Text>
          <Text style={[styles.styleTitle, {color: 'black', fontSize: 13}]}>
            {'Chọn thời gian bạn muốn xin chuyển đổi ca'}
          </Text>
          <View>
            {/*Select date*/}
            <InputView
              id={1}
              isCleared={false}
              editable={false}
              onPressText={(id, value) => {
                this.showPickerDate(1, true);
              }}
              style={styles.styleInput}
              styleTextInputElement={styles.styleTextInputElement}
              placeholder={'Chọn ngày'}
              value={configs.convertTimeDate(this.date, configs.FORMAT_DATE)}
              iconLeft={'calendar'}
              textTitle={'Ngày: '}
              onChangeText={this.getListBlock}
            />

            {/*Select change shift type*/}
            {/* <InputView
              id={1}
              isCleared={false}
              editable={false}
              style={styles.styleInput}
              styleTextInputElement={styles.styleTextInputElement}
              placeholder={'Chọn phương thức chuyển đổi'}
              value={this.dataChangeShift.title}
              blurOnSubmit={true}
              iconLeft={'parcel_locate'}
              textTitle={'Chọn loại chuyển đổi: '}
              onChangeText={this.setValueTextInput}
              onPressText={() => {
                let params = {
                  title: 'Chọn phương thức chuyển đổi',
                  id: '1',
                  itemSelect: this.dataChangeShift
                    ? this.dataChangeShift.id
                    : null,
                  dataList: [ChangeShiftTypes[1], ChangeShiftTypes[2]],
                };
                this.showDialogChonItemFromList(true, params);
              }}
            /> */}

            {/*Select block*/}
            {/* {this.dataChangeShift.id == 2 ? (
              <InputView
                id={2}
                isCleared={false}
                editable={false}
                style={[styles.styleInput]}
                styleTextInputElement={styles.styleTextInputElement}
                placeholder={'Chọn ca'}
                value={this.dataBlock.title}
                blurOnSubmit={true}
                iconLeft={'parcel_locate'}
                textTitle={'Chọn ca chuyển đổi: '}
                onChangeText={this.setValueTextInput}
                onPressText={() => {
                  let params = {
                    title: 'Chọn ca xin chuyển đổi',
                    id: '2',
                    itemSelect: this.dataBlock.id ? this.dataBlock.id : null,
                    dataList: this.props.listBlock.map((el, index) => {
                      let object = {
                        id: index + 1,
                        title: `Từ ${el.time_start} đến ${el.time_end}`,
                        value: index + 1,
                      };
                      console.log('object decleare', object);
                      return object;
                    }),
                  };
                  this.showDialogChonItemFromList(true, params);
                }}
              />
            ) : null} */}
            {/* {this.dataChangeShift.id !== 2 ? (
              <View style={{flexDirection: 'row'}}>
                <InputView
                  id={5}
                  isCleared={false}
                  editable={false}
                  onPressText={(id, value) => {
                    this.showPickerDate(2, true);
                  }}
                  style={[styles.styleInput, {flex: 2.5, paddingRight: 8}]}
                  styleTextInputElement={styles.styleTextInputElement}
                  placeholder={'Bắt đầu'}
                  value={this.startTime}
                  iconLeft={'calendar'}
                  textTitle={'Bắt đầu:'}
                />

                <InputView
                  id={6}
                  isCleared={false}
                  editable={false}
                  onPressText={(id, value) => {
                    this.showPickerDate(3, true);
                  }}
                  style={[styles.styleInput, {flex: 2.5, paddingLeft: 8}]}
                  styleTextInputElement={styles.styleTextInputElement}
                  placeholder={'Kết thúc'}
                  value={this.endTime}
                  iconLeft={'calendar'}
                  textTitle={'Kết thúc:'}
                />
              </View>
            ) : null} */}
          </View>
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
              {color: 'black', fontWeight: 'bold', fontSize: 18},
            ]}>
            {'Lý do'}
          </Text>
          <Text style={[styles.styleTitle, {color: 'black', fontSize: 15}]}>
            {'Nhập lý do đăng ký ca'}
          </Text>
          <InputView
            id={7}
            isCleared
            styleTextInputElement={[
              styles.styleTextInputElement,
              {
                height: 100,
              },
            ]}
            style={[styles.styleInput]}
            placeholder={'Nhập lý do đăng ký ca ...'}
            value={this.content}
            blurOnSubmit={true}
            iconLeft={'parcel-edit'}
            textTitle={'Lý do: '}
            styleTextTitle={{fontSize: 20}}
            multiline
            onChangeText={this.setValueTextInput}
          />
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
              {color: 'black', fontWeight: 'bold', fontSize: 18},
            ]}>
            {'Ghi chú'}
          </Text>
          <Text style={[styles.styleTitle, {color: 'black', fontSize: 15}]}>
            {'Nhập ghi chú nếu có'}
          </Text>
          <InputView
            id={8}
            isCleared
            styleTextInputElement={[
              styles.styleTextInputElement,
              {
                height: 100,
              },
            ]}
            style={[styles.styleInput]}
            placeholder={'Nhập lý ghi chú nếu có ...'}
            value={this.note}
            blurOnSubmit={true}
            iconLeft={'parcel-edit'}
            textTitle={'Ghi chú: '}
            styleTextTitle={{fontSize: 20}}
            multiline
            onChangeText={this.setValueTextInput}
          />
        </KeyboardAwareScrollView>

        <View style={{height: 65, justifyContent: 'center'}}>
          <TouchableOpacity
            onPress={this.setGuiYeuCau}
            style={styles.mainButton}>
            <Text
              style={[
                styles.styleTitle,
                {color: 'white', fontWeight: 'bold', fontSize: 18},
              ]}>
              {'Gửi yêu cầu'}
            </Text>
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={this.state.isShowPickerDate}
          mode={this.indexPickerDate === 1 ? 'date' : 'time'}
          locale={'vi'}
          date={new Date()}
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

const mapStateToProps = ({OrderReducer: {listBlock, listBlockWithUser}}) => ({
  listBlock,
  listBlockWithUser,
});

const mapDispatchToProps = (dispatch) => {
  return {
    showLoadding: () => {
      dispatch(actions.showLoading());
    },
    hideLoadding: () => {
      dispatch(actions.hideLoading());
    },
    pushNotifiToAdmin: (params) => {
      api.pushNotifiToAdminNghiPhep(dispatch, params);
    },
    getListBlock: (params) => {
      api.getListBlock(dispatch, params);
    },
    getListBlockWithUser: (params) => {
      api.getListBlockWithUser(dispatch, params);
    },
    createApplicationForChangeShift: (params) => {
      api.createApplicationForChangeShift(dispatch, params);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShiftChangeTab);

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
  mainButton: {
    backgroundColor: configs.colorMain,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 8,
    shadowOpacity: 0.6,
    height: 48,
    marginHorizontal: 12,
  },
});
