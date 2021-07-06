import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Text } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView, InputView, RadioForm, DialogSelectItemFromList } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { models } from '../../../../commons/model';
import { actions } from '../../../../commons/action';
import { api } from '../../../../commons/api/Api';
import Toast from "react-native-simple-toast";
import { TextInput, HelperText, useTheme } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from 'react-native-vector-icons/Ionicons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { instance } from '../../../../commons/api/instanceService';

const DataRadio = [
    { index: 1, label: "Trong ngày", value: "1" },
    { index: 2, label: "Nhiều ngày", value: "2" },
]
const ListTuyChon = configs.loaiXinNghiPhep()
class XinNghiPhepScreen extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            checkNgayNghiDate: 0,
            isShowPickerDate: false,
            isShowDialog: false,
            reRender: false,
            textName: ''
        }
        this.fromTime = new Date()
        this.toTime = new Date()
        this.dateNgayNghi = ''
        this.fromDate = new Date()
        this.fromDateNhieuNgay = ''
        this.toDateNhieuNgay = ''
        this.indexPickerDate = 0
        this.dataRadio = DataRadio[0]

        this.textName = ""
        this.textPhone = ""
        this.textAddress = ""
        this.textContent = ""

        this.dataSeleLoaiNghi = {}
        this.dataLogin = models.getDataLogin()

        this.handleSelectedPickerDate = this.handleSelectedPickerDate.bind(this)
        this.showPickerDate = this.showPickerDate.bind(this)
        this.showDialogChonItemFromList = this.showDialogChonItemFromList.bind(this)
        this.setValueTextInput = this.setValueTextInput.bind(this)
        this.setGuiYeuCau = this.setGuiYeuCau.bind(this)

        this.location = {}
        this.address_customer = ''
    }

    handleSelectedPickerDate = (date) => {
        let valueDate = configs.convertTimeDate(date, configs.FORMAT_DATE)
        if (this.indexPickerDate === 2) {
            this.fromTime = date
        } else if (this.indexPickerDate === 3) {
            this.toTime = date
        } else if (this.indexPickerDate === 1) {
            this.fromDate = date
        } else if (this.indexPickerDate === 5) {
            if (this.fromDateNhieuNgay && configs.checkDateAfterDate1(this.fromDateNhieuNgay, valueDate, configs.FORMAT_DATE, configs.FORMAT_DATE) === 1) {
                setTimeout(() => {
                    configs.showAlert("Từ ngày không được lớn hơn hoặc bằng Đến ngày")
                }, 500);
            } else {
                this.toDateNhieuNgay = date
            }
        } else if (this.indexPickerDate === 4) {
            if (this.toDateNhieuNgay && configs.checkDateAfterDate1(date, this.toDateNhieuNgay, configs.FORMAT_DATE, configs.FORMAT_DATE) === 1) {
                setTimeout(() => {
                    configs.showAlert("Từ ngày không được lớn hơn hoặc bằng Đến ngày")
                }, 500);
            } else {
                this.fromDateNhieuNgay = date
            }
        }
        this.showPickerDate(this.indexPickerDate, false)
    }

    showPickerDate = (indexPickerDate, isShow = true) => {
        this.indexPickerDate = indexPickerDate
        this.setState(state => ({ isShowPickerDate: state.isShowPickerDate = isShow }))
    }

    showDialogChonItemFromList(isShow, dataDialog) {
        if (isShow) {
            this.dataDialogChonItemFromList = dataDialog
        }
        this.setState({
            isShowDialog: isShow,
        })
    }

    setValueTextInput = (id, data) => {
        if (id === '1') {
            this.textName = data
        } else if (id === '2') {
            this.textPhone = data
        } else if (id === '3') {
            this.textAddress = data
        } else if (id === '4') {
            this.textContent = data
        }

        this.reRender()
    }

    reRender = () => {
        this.setState(prevState => ({ reRender: prevState.reRender = !this.state.reRender }))
    }

    setGuiYeuCau = () => {
        if (this.fromDate === '') {
            configs.showAlert("Bạn không được bỏ trống ngày")
        } else if (this.fromTime === '') {
            configs.showAlert("Bạn không được bỏ trống giờ bắt đầu")
        } else if (this.toTime === '') {
            configs.showAlert("Bạn không được bỏ trống giờ kết thúc")
        } else if (!this.textPhone || this.textPhone.length < 9) {
            configs.showAlert("Trường số điện thoại ít nhất phải 9 chữ số")
        } else if (!this.textName || this.textName.length < 3) {
            configs.showAlert("Trường tên khách hàng ít nhất phải 3 chữ cái")
        } else if (!this.textContent || !this.textContent.trim()) {
            configs.showAlert("Bạn cần nhập nội dung")
        } else {
            let params = params = {
                time_start: (this.fromDate && configs.convertTimeDate(this.fromDate, configs.FORMAT_DATE) || "")
                    + ' ' + (this.fromTime && configs.convertTimeDate(this.fromTime, configs.FORMAT_HH_MM_SS) || ""),
                time_end: (this.fromDate && configs.convertTimeDate(this.fromDate, configs.FORMAT_DATE) || "")
                    + ' ' + (this.toTime && configs.convertTimeDate(this.toTime, configs.FORMAT_HH_MM_SS) || ""),
                title: "Xin Phép",
                phone_customer: this.textPhone,
                name_customer: this.textName,
                content: this.textContent,
                // typeOrder: 4,
                // location: this.location,
                // address_customer: this.address_customer
            }
            // console.log('___________________', params);
            // this.props.createRequestOrder(params)
            instance.post(
                '/api/v2/user/request/bussiness/store_bussiness',
                params,
            ).then(res => showMessage(res.data?.message))
                .catch(e => showMessage('Tạo đơn xin phép thất bại.'));
        }
    }

    draw1Date = () => {
        let fromDateDisplay = this.fromDate && configs.convertTimeDate(this.fromDate, configs.FORMAT_DATE_VN) || ""
        return (
            <View>
                <InputView
                    id={1}
                    onPressText={() => this.showPickerDate(1)}
                    isCleared
                    multiline
                    editable={false}
                    style={[styles.styleInput, {}]}
                    styleTextInputElement={[styles.styleTextInputElement, {
                    }]}
                    styleInput={{
                    }}
                    placeholder={"Chọn ngày bạn muốn xin..."}
                    value={fromDateDisplay}
                    iconLeft={'calendar'}
                    textTitle={"Chọn ngày bạn muốn xin: "}
                    onChangeText={(id, value) => {
                        if (value === '') {
                            this.fromDate = ''
                            this.reRender()
                        }
                    }}
                />

                <View style={{ flexDirection: 'row' }}>
                    <InputView
                        id={2}
                        onPressText={() => this.showPickerDate(2)}
                        isCleared
                        multiline
                        editable={false}
                        style={[styles.styleInput, { flex: 1, marginRight: 4 }]}
                        styleTextInputElement={[styles.styleTextInputElement, {
                        }]}
                        styleInput={{
                        }}
                        placeholder={"Từ..."}
                        value={this.fromTime && configs.convertTimeDate(this.fromTime, configs.FORMAT_HH_MM) || ""}
                        iconLeft={'calendar'}
                        textTitle={"   Từ: "}
                        onChangeText={(id, value) => {
                            if (value === '') {
                                this.fromTime = ''
                                this.reRender()
                            }
                        }}
                    />
                    <InputView
                        id={3}
                        onPressText={() => this.showPickerDate(3)}
                        isCleared
                        multiline
                        editable={false}
                        style={[styles.styleInput, { flex: 1, marginLeft: 4 }]}
                        styleTextInputElement={[styles.styleTextInputElement, {
                        }]}
                        styleInput={{
                        }}
                        placeholder={"Đến..."}
                        value={this.toTime && configs.convertTimeDate(this.toTime, configs.FORMAT_HH_MM) || ""}
                        iconLeft={'calendar'}
                        textTitle={"   Đến: "}
                        onChangeText={(id, value) => {
                            if (value === '') {
                                this.toTime = ''
                                this.reRender()
                            }
                        }}
                    />
                </View>
            </View>
        )
    }

    drawNhieuNgay = () => {

        let fromDateDisplayNhieuNgay = this.fromDateNhieuNgay && configs.convertTimeDate(this.fromDateNhieuNgay, configs.FORMAT_DATE_VN) || ""
        let toDateDisplayNhieuNgay = this.toDateNhieuNgay && configs.convertTimeDate(this.toDateNhieuNgay, configs.FORMAT_DATE_VN) || ""
        return (
            <View style={{ flexDirection: 'row' }}>
                <InputView
                    id={1}
                    onPressText={() => this.showPickerDate(4)}
                    isCleared
                    multiline
                    editable={false}
                    style={[styles.styleInput, { flex: 1, marginRight: 4 }]}
                    styleTextInputElement={[styles.styleTextInputElement, {
                    }]}
                    styleInput={{
                    }}
                    placeholder={"Từ ngày..."}
                    value={fromDateDisplayNhieuNgay}
                    iconLeft={'calendar'}
                    textTitle={"Từ ngày: "}
                    onChangeText={(id, value) => {
                        if (value === '') {
                            this.fromDateNhieuNgay = ''
                            this.reRender()
                        }
                    }}
                />
                <InputView
                    id={1}
                    onPressText={() => this.showPickerDate(5)}
                    isCleared
                    multiline
                    editable={false}
                    style={[styles.styleInput, { flex: 1, marginLeft: 4 }]}
                    styleTextInputElement={[styles.styleTextInputElement, {
                    }]}
                    styleInput={{
                    }}
                    placeholder={"Đến ngày..."}
                    value={toDateDisplayNhieuNgay}
                    iconLeft={'calendar'}
                    textTitle={"Đến ngày: "}
                    onChangeText={(id, value) => {
                        if (value === '') {
                            this.toDateNhieuNgay = ''
                            this.reRender()
                        }
                    }}
                />
            </View>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps='handled'
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 12, marginTop: 12, paddingBottom: 50 }}
                    showsVerticalScrollIndicator={false}
                >
                    {this.draw1Date()}

                    <View style={{ height: 0.5, width: '100%', borderColor: configs.colorBorder, borderWidth: 0.5, marginVertical: 12 }} />
                    <Text style={[styles.styleTitle, { color: 'black', fontWeight: 'bold', fontSize: 18 }]}>{'Thông tin thêm'}</Text>
                    <Text style={[styles.styleTitle, { color: 'black', fontSize: 13 }]}>{'Nhập thông tin thêm cho đơn xin phép này.'}</Text>
                    <TextInput
                        theme={{ colors: { primary: configs.colorMain } }}
                        mode="outlined"
                        style={styles.styleTextInput}
                        label="Tên khách hàng"
                        placeholder="Nhập tên khách hàng"
                        // error={this.state.textName === ''}
                        value={this.textName}
                        onChangeText={(text) => this.setValueTextInput('1', text)}
                        // right={<TextInput.Affix text="/100" />}
                        selectionColor={configs.colorMain}
                        left={
                            <TextInput.Icon
                                name={() => <IconView name={'ic-user'} size={18} />}
                                onPress={() => {
                                    // changeIconColor('outlineLeftIcon');
                                }}
                            />
                        }
                    />
                    <TextInput
                        theme={{ colors: { primary: configs.colorMain } }}
                        mode="outlined"
                        style={styles.styleTextInput}
                        label="Số điện thoại khách hàng"
                        keyboardType={'phone-pad'}
                        placeholder="Nhập số điện thoại khách hàng"
                        // error={this.state.textName === ''}
                        value={this.textPhone}
                        onChangeText={(text) => this.setValueTextInput('2', text)}
                        // right={<TextInput.Affix text="/100" />}
                        selectionColor={configs.colorMain}
                        left={
                            <TextInput.Icon
                                name={() => <IconView name={'telephone'} size={18} />}
                                onPress={() => {
                                    // changeIconColor('outlineLeftIcon');
                                }}
                            />
                        }
                    />
                    <GooglePlacesAutocomplete
                        renderLeftButton={() => <IconView name={'user-profile-edit'} size={18} style={{ marginLeft: 15 }} />}
                        styles={{
                            textInputContainer: {
                                backgroundColor: '5d5d5d',
                                height: 60,
                                marginTop: 12,
                                borderWidth: 1,
                                borderColor: 'black',
                                borderRadius: 5,
                            },
                            textInput: {
                                height: 58,
                                color: '#5d5d5d',
                                fontSize: 16,
                            },
                        }}
                        placeholder='Địa chỉ công tác'
                        fetchDetails={true}
                        onPress={(data, details = null) => {
                            this.location = JSON.stringify(details.geometry.location.lat) + ',' + JSON.stringify(details.geometry.location.lng)
                            this.address_customer = JSON.stringify(data.description)
                        }}

                        query={{
                            key: 'AIzaSyAbwkvRATW1ZhfSW6HTUCHS_SLcQ2rfHcM',
                            language: 'vi',
                        }}

                    />
                    {/* <TextInput
                        theme={{ colors: { primary: configs.colorMain } }}
                        mode="outlined"
                        style={styles.styleTextInput}
                        label="Địa chỉ công tác"
                        placeholder="Nhập địa chỉ công tác"
                        // error={this.state.textName === ''}
                        value={this.textAddress}
                        onChangeText={(text) => this.setValueTextInput('3', text)}
                        // right={<TextInput.Affix text="/100" />}
                        selectionColor={configs.colorMain}
                        left={
                            <TextInput.Icon
                                name={() => <IconView name={'user-profile-edit'} size={18} />}
                                onPress={() => {
                                    // changeIconColor('outlineLeftIcon');
                                }}
                            />
                        }
                    /> */}
                    <TextInput
                        theme={{ colors: { primary: configs.colorMain } }}
                        mode="outlined"
                        style={[styles.styleTextInput]}
                        label="Nội dung"
                        placeholder="Nhập nội dung"
                        // error={this.state.textName === ''}
                        value={this.textContent}
                        onChangeText={(text) => this.setValueTextInput('4', text)}
                        // right={<TextInput.Affix text="/100" />}
                        selectionColor={configs.colorMain}
                        multiline={true}
                        left={
                            <TextInput.Icon
                                name={() => <IconView name={'parcel-edit'} size={18} />}
                                onPress={() => {
                                    // changeIconColor('outlineLeftIcon');
                                }}
                            />
                        }
                    />
                </KeyboardAwareScrollView>

                <View style={{ height: 65, justifyContent: 'center' }}>
                    <TouchableOpacity onPress={this.setGuiYeuCau} style={{
                        // <TouchableOpacity onPress={() => { this.findCoordinates() }} style={{
                        backgroundColor: configs.colorMain,
                        justifyContent: 'center', alignItems: 'center',
                        borderRadius: 8, height: 48,
                        shadowOffset: {
                            width: 0,
                            height: 3
                        },
                        shadowRadius: 8,
                        shadowOpacity: 0.6,
                        shadowColor: '#000',
                        elevation: 3,
                        marginHorizontal: 12
                    }}>
                        <Text style={[styles.styleTitle, { color: 'white', fontWeight: 'bold', fontSize: 18 }]}>{'Gửi yêu cầu'}</Text>
                    </TouchableOpacity>
                </View>

                <DateTimePickerModal
                    isVisible={this.state.isShowPickerDate}
                    mode={this.indexPickerDate === 1 || this.indexPickerDate === 4 || this.indexPickerDate === 5 ? 'date' : 'time'}
                    locale={'vi'}
                    date={new Date()}
                    confirmTextIOS='Thay Đổi'
                    cancelTextIOS='Hủy'
                    titleIOS={"Chọn ngày giờ"}
                    onConfirm={this.handleSelectedPickerDate}
                    onCancel={() => this.showPickerDate(this.indexPickerDate, false)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    styleTitle: {
        fontSize: configs.fontSize14_5,
        fontFamily: 'Lato-Regular',
        color: 'black',
    },
    styleTextInput: {
        // marginH: 12,
        marginTop: 12,
        backgroundColor: 'white',
    },
    styleTextInputElement: {
        flexDirection: 'row',
        height: configs.heightInput40,
        borderColor: configs.colorTitleCard,
        // borderColor: configs.colorBorder,
        borderWidth: 0.5,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'

    },
    styleInput: {
        marginTop: configs.margin10,
    },
})

const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch) => {
    return {
        showLoadding: () => {
            dispatch(actions.showLoading())
        },
        hideLoadding: () => {
            dispatch(actions.hideLoading())
        },
        createRequestOrder: (params) => {
            api.createRequestOrder(dispatch, params)
        }
    };
}


function showMessage(msg) {
    setTimeout(() => {
      Alert.alert(
        configs.NAME_APP,
        msg,
        [{ text: configs.DONG_Y, onPress: () => { } }],
        { cancelable: false },
      );
    }, 700);
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(XinNghiPhepScreen)