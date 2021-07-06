import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Text, Platform } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView, InputView, RadioForm, DialogSelectItemFromList } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DateTimePicker from 'react-native-modal-datetime-picker'
import Geolocation from '@react-native-community/geolocation';
import { models } from '../../../../commons/model';
import Toast from "react-native-simple-toast";
import { actions } from '../../../../commons/action';
import { api } from '../../../../commons/api/Api';
const ListTuyChon = configs.loaiXinNghiPhep()
class XinNghiPhepScreen extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            checkNgayNghiDate: 0,
            isShowPickerDate: false,
            isShowDialog: false,
            reRender: false
        }
        this.dateNgayNghi = ''
        this.fromDate = ''
        this.indexPickerDate = 0

        this.dataSeleLoaiNghi = {}
        this.dataLogin = models.getDataLogin()
        this.dataReason = []
        this.blook = []
        this.Dau = []
        this.Cuoi = []
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
        let dateStart = (this.fromDate && configs.convertTimeDate(this.fromDate, configs.FORMAT_DATE) || "")
        let dateEnd = (this.fromDate && configs.convertTimeDate(this.fromDate, configs.FORMAT_DATE) || "")
        console.log('dateStart     ', dateStart);
        console.log('dateEnd     ', dateEnd);

        let params = {
            date_start: dateStart,
            date_end: dateEnd,
        }
        this.getListBlookCa(params)
        this.showPickerDate(this.indexPickerDate, false)
    }

    showPickerDate = (indexPickerDate, isShow = true) => {
        this.indexPickerDate = indexPickerDate
        this.setState(state => ({ isShowPickerDate: state.isShowPickerDate = isShow }))
    }

    setValueTextInput = (id, data) => {
        if (id === '3') {
            this.dataSeleLoaiNghi = data
        } else if (id === 3) {
            this.textLyDoNghi = data
        }
        this.reRender()
    }

    setGuiYeuCau() {
        //type =1: xin nghỉ nửa ngày, type=2, 3: xin nghỉ nhiều ngày 
        if (this.fromDate === '') {
            configs.showAlert("Bạn không được bỏ trống ngày nghỉ")
        } else {
            let toDateDisplay = (this.fromDate && configs.convertTimeDate(this.fromDate, configs.FORMAT_DATE) || "")
            let fromDateDisplay = (this.fromDate && configs.convertTimeDate(this.fromDate, configs.FORMAT_DATE) || "")

            this.data = this.props.listBlockCa.detail.forEach(element => {
                this.Dau = element[0][0].time_start
                this.Cuoi = element[0][element[0].length - 1].time_end
            });

            let params = {
                time_start: toDateDisplay + ' ' + configs.quyDoiTimeStampToTime(this.Dau),
                time_end: fromDateDisplay + ' ' + configs.quyDoiTimeStampToTime(this.Cuoi),
                state: 1,
            }
            return params
        }
        return null
    }

    setDataReason(data) {
        this.dataReason = data
    }

    reRender = () => {
        this.setState(prevState => ({ reRender: prevState.reRender = !this.state.reRender }))
    }

    render() {
        let fromDateDisplay = this.fromDate && configs.convertTimeDate(this.fromDate, configs.FORMAT_DATE) || ""
        let dateShow = this.fromDate

        return (
            <View style={{ flex: 1 }}>
                <InputView
                    id={1}
                    onPressText={(id, value) => {
                        this.showPickerDate(1, true)
                    }}
                    isCleared
                    multiline
                    editable={false}
                    style={[styles.styleInput, {}]}
                    styleTextInputElement={[styles.styleTextInputElement, {
                    }]}
                    styleInput={{
                    }}
                    placeholder={"Chọn ngày nghỉ..."}
                    value={fromDateDisplay}
                    iconLeft={'calendar'}
                    textTitle={"Chọn ngày nghỉ: "}
                    onChangeText={(id, value) => {
                        ``
                        if (value === '') {
                            this.fromDate = ''
                            this.reRender()
                        }
                    }}
                />

                <DateTimePickerModal
                    style={{ dateText: { color: '#fff' } }}
                    isVisible={this.state.isShowPickerDate}
                    mode={'date'}
                    locale={'vi'}
                    date={dateShow ? new Date(dateShow) : new Date()}
                    confirmTextIOS='Thay Đổi'
                    cancelTextIOS='Hủy'
                    titleIOS={"Chọn ngày nghỉ"}
                    onConfirm={this.handleSelectedPickerDate}
                    onCancel={() => this.showPickerDate(this.indexPickerDate, false)}
                />

                <DialogSelectItemFromList
                    isShowDialog={this.state.isShowDialog}
                    dataDialog={this.dataDialogChonItemFromList}
                    showDialog={this.showDialogChonItemFromList}
                    onDataSelectItem={this.setValueTextInput} />

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
    pickerContainerStyleIOS: {
        backgroundColor: 'black',
        color: 'white'
    }
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
        },
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(XinNghiPhepScreen)