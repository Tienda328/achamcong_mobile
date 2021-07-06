import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Text, Platform } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView, InputView, RadioForm, DialogSelectItemFromList } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Geolocation from '@react-native-community/geolocation';
import { models } from '../../../../commons/model';
import Toast from "react-native-simple-toast";
import { actions } from '../../../../commons/action';
import { api } from '../../../../commons/api/Api';
const ListNghiNuaNgay = [
    {
        id: 1,
        title: 'Nửa ca đầu',
        value: 1
    },
    {
        id: 2,
        title: 'Nửa ca sau',
        value: 2
    }
]

class XinNghiPhepScreen extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            checkNgayNghiDate: 0,
            isShowPickerDate: false,
            isShowDialog: false,
            reRender: false
        }
        this.toDate = ''
        this.fromDate = ''
        this.indexPickerDate = 0
        this.isShowInputView = false
        this.dataSeleLoaiNghi = {}
        this.dataSeleLoaiCaNghi = {}
        this.dataLogin = models.getDataLogin()
        this.dataReason = []

        this.detail = {}
        this.blook = []
        this.handleSelectedPickerDate = this.handleSelectedPickerDate.bind(this)
        this.showPickerDate = this.showPickerDate.bind(this)
        this.setValueTextInput = this.setValueTextInput.bind(this)
        this.setGuiYeuCau = this.setGuiYeuCau.bind(this)
        this.showDialogChonItemFromList = this.showDialogChonItemFromList.bind(this)
        this.getListBlookCa = this.getListBlookCa.bind(this)
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    getListBlookCa = (params) => {
        this.props.getListBlookCa(params);
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    showDialogChonItemFromList(isShow, dataDialog) {
        if (isShow) {
            this.dataDialogChonItemFromList = dataDialog
        }
        this.setState({
            isShowDialog: isShow,
        })
    }

    handleSelectedPickerDate = (date) => {
        this.fromDate = date
        this.showPickerDate(false)
        let dateStart = (this.fromDate && configs.convertTimeDate(this.fromDate, configs.FORMAT_DATE) || "")
        let dateEnd = (this.fromDate && configs.convertTimeDate(this.fromDate, configs.FORMAT_DATE) || "")
        console.log('dateStart     ', dateStart);
        console.log('dateEnd     ', dateEnd);

        let params = {
            date_start: dateStart,
            date_end: dateEnd,
        }
        this.getListBlookCa(params)
    }

    showPickerDate = (isShow = true) => {
        this.dataSeleLoaiCaNghi = {}
        this.isShowInputView = true
        this.setState(state => ({ isShowPickerDate: state.isShowPickerDate = isShow }))
    }

    setValueTextInput = (id, data) => {
        if (id === '3') {
            this.dataSeleLoaiNghi = data
        } else if (id === 3) {
            this.textLyDoNghi = data
        } else if (id === '4') {
            this.dataSeleLoaiCaNghi = data
            this.time_start = ''
            this.time_end = ''
            if (this.dataLogin.shift && this.dataLogin.shift[0] && this.dataLogin.shift[0].time_start && this.dataLogin.shift[0].time_end) {
                if (data.value === 1) {
                    this.time_start = this.dataLogin.shift[0].time_start + ' '
                    this.time_end = this.dataLogin.shift[0].mid_start + ' '
                } else {
                    this.time_start = this.dataLogin.shift[0].mid_end + ' '
                    this.time_end = this.dataLogin.shift[0].time_end + ' '
                }
            }
            console.log(this.time_start + '   ' + this.time_end)
        }
        this.reRender()
    }

    setDataReason(data) {
        this.dataReason = data
    }

    setGuiYeuCau() {
        //type =1: xin nghỉ nửa ngày, type=2, 3: xin nghỉ nhiều ngày 
        if (this.fromDate === '') {
            configs.showAlert("Bạn không được bỏ trống ngày nghỉ")
        } else if (!this.dataSeleLoaiCaNghi.id) {
            configs.showAlert('Bạn cần chọn loại ca.')
        } else if (!this.time_start || !this.time_end) {
            configs.showAlert('Bị lỗi khi lấy thời gian ca.')
        } else {
            let fromDateDisplay = (this.fromDate && configs.convertTimeDate(this.fromDate, configs.FORMAT_DATE) || "") + ' ' + this.time_start
            let toDateDisplay = (this.fromDate && configs.convertTimeDate(this.fromDate, configs.FORMAT_DATE) || "") + ' ' + this.time_end
            let params = {
                time_start: fromDateDisplay,
                time_end: toDateDisplay,
                state: 1,
            }
            return params
        }

        return null
    }

    reRender = () => {
        this.setState(prevState => ({ reRender: prevState.reRender = !this.state.reRender }))
    }

    render() {
        let fromDateDisplay = this.fromDate && configs.convertTimeDate(this.fromDate, configs.FORMAT_DATE) || ""
        let dateShow = this.fromDate

        return (
            <View style={{ flex: 1 }}>
                {/* <Text style={[styles.styleTitle, { color: 'black', fontWeight: 'bold', fontSize: 18 }]}>{'Thời gian'}</Text>
                <Text style={[styles.styleTitle, { color: 'black', fontSize: 13 }]}>{'Chọn thời gian bạn nghỉ hay đi muộn'}</Text> */}

                <InputView
                    id={1}
                    onPressText={this.showPickerDate}
                    isCleared
                    multiline
                    editable={false}
                    style={[styles.styleInput, {}]}
                    styleTextInputElement={[styles.styleTextInputElement, {
                    }]}
                    styleInput={{
                    }}
                    placeholder={"Chọn ngày bạn muốn xin nghỉ..."}
                    value={fromDateDisplay}
                    iconLeft={'calendar'}
                    textTitle={"Chọn ngày bạn muốn xin nghỉ: "}
                    onChangeText={(id, value) => {
                        if (value === '') {
                            this.fromDate = ''
                            this.reRender()
                        }
                    }}
                />
                {this.isShowInputView ?
                    <InputView
                        id={2}
                        isCleared={false}
                        editable={false}
                        style={[styles.styleInput]}
                        styleTextInputElement={[styles.styleTextInputElement]}
                        placeholder={"Chọn ca bạn muốn xin nghỉ ..."}
                        value={this.dataSeleLoaiCaNghi.title}
                        blurOnSubmit={true}
                        iconLeft={'user-profile-edit'}
                        textTitle={"Chọn ca bạn muốn xin nghỉ: "}
                        onChangeText={this.setValueTextInput}
                        onPressText={() => {
                            this.data = this.props.listBlockCa.detail.forEach(element => {
                                this.blook = element[0]
                            });
                            let params = {
                                title: 'Chọn ca quên chấm công',
                                id: '4',
                                itemSelect: this.dataSeleLoaiCaNghi ? this.dataSeleLoaiCaNghi.id : null,
                                dataList: this.blook.map((el, index) => {
                                    let object = {
                                        id: index + 1,
                                        title: `Từ ${configs.quyDoiTimStampToGio(el.time_start)} đến ${configs.quyDoiTimStampToGio(el.time_end)}`,
                                        value: index + 1,

                                    };
                                    return object;
                                }),
                            }
                            this.showDialogChonItemFromList(true, params)
                        }}
                    /> : null
                }

                <DialogSelectItemFromList
                    isShowDialog={this.state.isShowDialog}
                    dataDialog={this.dataDialogChonItemFromList}
                    showDialog={this.showDialogChonItemFromList}
                    onDataSelectItem={this.setValueTextInput} />

                <DateTimePickerModal
                    isVisible={this.state.isShowPickerDate}
                    mode={'date'}
                    locale={'vi'}
                    date={dateShow ? new Date(this.fromDate) : new Date()}
                    confirmTextIOS='Thay Đổi'
                    cancelTextIOS='Hủy'
                    titleIOS={"Chọn ngày nghỉ"}
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
        justifyContent: 'center',
        alignItems: 'center'
    },
})

const mapStateToProps = ({ OrderReducer: { listBlockCa } }) => ({
    listBlockCa,
});

const mapDispatchToProps = (dispatch) => {
    return {
        showLoadding: () => {
            dispatch(actions.showLoading())
        },
        getListBlookCa: (params) => {
            api.getListBlookCa(dispatch, params)
        },
        hideLoadding: () => {
            dispatch(actions.hideLoading())
        },
        pushNotifiToAdmin: (params) => {
            api.pushNotifiToAdminNghiPhep(dispatch, params)
        }
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(XinNghiPhepScreen)