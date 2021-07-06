import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Text } from 'react-native';
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
import XinNghiNhieuNgayScreen from './XinNghiNhieuNgayScreen'
import XinNghi1NgayScreen from './XinNghi1NgayScreen'
import XinNghiNuaNgayScreen from './XinNghiNuaNgayScreen'

const dataRadio = [
    {
        id: 2,
        title: 'Xin nghỉ một ngày',
        value: 2
    },
    {
        id: 3,
        title: 'Xin nghỉ nhiều ngày',
        value: 3
    },
    {
        id: 1,
        title: 'Xin nghỉ theo ca',
        value: 1
    },
]
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
        this.toDate = ''
        this.dateNgayNghi = ''
        this.fromDate = ''
        this.indexPickerDate = 0
        this.dataReason = []

        this.dataSeleLoaiNghi = {}
        this.dataSelectRadio = dataRadio[0]
        this.dataLogin = models.getDataLogin()

        this.handleSelectedPickerDate = this.handleSelectedPickerDate.bind(this)
        this.showPickerDate = this.showPickerDate.bind(this)
        this.showDialogChonItemFromList = this.showDialogChonItemFromList.bind(this)
        this.setValueTextInput = this.setValueTextInput.bind(this)
        this.setGuiYeuCau = this.setGuiYeuCau.bind(this)
    }

    componentDidMount() {
        this.props.getResonSabbatical()
    }

    handleSelectedPickerDate = (date) => {
        let valueDate = configs.convertTimeDate(date, configs.FORMAT_DATE)
        if (this.indexPickerDate === 0) {
            this.dateNgayNghi = date
        } else if (this.indexPickerDate === 1) {
            if (this.toDate && configs.checkDateAfterDate(valueDate, this.toDate, configs.FORMAT_DATE, configs.FORMAT_DATE) === 1) {
                setTimeout(() => {
                    configs.showAlert("Từ ngày không được lớn hơn Đến ngày")
                }, 500);
            } else {
                this.fromDate = date
            }
        } else {
            if (this.fromDate && configs.checkDateAfterDate(this.fromDate, date, configs.FORMAT_DATE, configs.FORMAT_DATE) === 1) {
                setTimeout(() => {
                    configs.showAlert("Từ ngày không được lớn hơn Đến ngày")
                }, 500);
            } else {
                this.toDate = date
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
        if (id === '3') {
            this.dataSeleLoaiNghi = data
        } else if (id === 3) {
            this.textLyDoNghi = data
        } else if (id === 'LoaiNghi') {
            console.log("data:    " + JSON.stringify(data))
            this.dataSelectRadio = data
        }

        this.reRender()
    }

    setGuiYeuCau = () => {
        let data = {}
        if (this.dataSelectRadio.id === 1) {
            data = this.refNuaNgay.setGuiYeuCau()
        } else if (this.dataSelectRadio.id === 2) {
            data = this.refNghi1Ngay.setGuiYeuCau()
        } else if (this.dataSelectRadio.id === 3) {
            data = this.refNghiNhieuNgay.setGuiYeuCau()
        }
        if (data) {
            if (!this.dataSeleLoaiNghi.id) {
                configs.showAlert('Bạn cần chọn loại lý do')
            } else if (!this.textLyDoNghi || this.textLyDoNghi.trim() === '') {
                configs.showAlert('Bạn cần nhập lý do')
            } else {
                data.id_reason = this.dataSeleLoaiNghi.id
                data.content = this.textLyDoNghi
                data.title = this.dataSeleLoaiNghi.title
                this.props.createRequestOrder(data)
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.OrderReducer) {
            if (this.props.OrderReducer.dataReason !== prevProps.OrderReducer.dataReason) {
                let dataResonOrder = this.props.OrderReducer.dataReason?.data
                this.dataReason = []
                for (let i = 0; i < dataResonOrder.length; i++) {
                    this.dataReason.push({
                        id: dataResonOrder[i].id,
                        title: dataResonOrder[i].name,
                        value: dataResonOrder[i].id
                    })
                }
                this.reRender()
            }
        }
    }

    reRender = () => {
        this.setState(prevState => ({ reRender: prevState.reRender = !this.state.reRender }))
    }

    render() {
        let fromDateDisplay = this.fromDate && configs.convertTimeDate(this.fromDate, configs.FORMAT_DATE_VN) || ""
        let toDateDisplay = this.toDate && configs.convertTimeDate(this.toDate, configs.FORMAT_DATE_VN) || ""
        let dateDisplay = this.dateNgayNghi && configs.convertTimeDate(this.dateNgayNghi, configs.FORMAT_DATE_VN) || ""
        let dateShow = this.indexPickerDate === 1 ? this.fromDate : (this.indexPickerDate === 2 ? this.toDate : this.dateNgayNghi)

        return (
            <View style={{ flex: 1 }}>
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps='handled'
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 12, marginTop: 12, paddingBottom: 50 }}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={[styles.styleTitle, { color: 'black', fontWeight: 'bold', fontSize: 18 }]}>{'Thời gian'}</Text>
                    <Text style={[styles.styleTitle, { color: 'black', fontSize: 13 }]}>{'Chọn thời gian bạn nghỉ hay đi muộn'}</Text>

                    <InputView
                        id={"LoaiNghi"}
                        isCleared
                        editable={false}
                        style={[styles.styleInput]}
                        styleTextInputElement={[styles.styleTextInputElement]}
                        placeholder={"Chọn loại bạn muốn nghỉ phép..."}
                        value={this.dataSelectRadio.title}
                        blurOnSubmit={true}
                        iconLeft={'user-profile-edit'}
                        textTitle={"Chọn loại nghỉ: "}
                        onChangeText={this.setValueTextInput}
                        onPressText={() => {
                            let params = {
                                title: 'Chọn loại nghỉ',
                                id: "LoaiNghi",
                                itemSelect: this.dataSelectRadio ? this.dataSelectRadio.id : null,
                                dataList: dataRadio,
                            }
                            this.showDialogChonItemFromList(true, params)
                        }}
                    />
                    {this.dataSelectRadio.value === 1 ?
                        <XinNghiNuaNgayScreen onRef={ref => { this.refNuaNgay = ref }} /> :
                        (this.dataSelectRadio.value === 2 ? <XinNghi1NgayScreen onRef={ref => { this.refNghi1Ngay = ref }} /> : <XinNghiNhieuNgayScreen onRef={ref => { this.refNghiNhieuNgay = ref }} />)}

                    <View style={{ height: 0.5, width: '100%', borderColor: configs.colorBorder, borderWidth: 0.5, marginVertical: 12 }} />
                    <Text style={[styles.styleTitle, { color: 'black', fontWeight: 'bold', fontSize: 18 }]}>{'Lý do'}</Text>
                    <Text style={[styles.styleTitle, { color: 'black', fontSize: 13 }]}>{'Nhập lý do bạn xin nghỉ'}</Text>

                    <InputView
                        id={3}
                        isCleared
                        editable={false}
                        style={[styles.styleInput]}
                        styleTextInputElement={[styles.styleTextInputElement]}
                        placeholder={"Chọn loại nghỉ ..."}
                        value={this.dataSeleLoaiNghi.title}
                        blurOnSubmit={true}
                        iconLeft={'user-profile-edit'}
                        textTitle={"Chọn loại nghỉ: "}
                        onChangeText={this.setValueTextInput}
                        onPressText={() => {
                            let params = {
                                title: 'Chọn loại nghỉ',
                                id: '3',
                                itemSelect: this.dataSeleLoaiNghi ? this.dataSeleLoaiNghi.id : null,
                                dataList: this.dataReason,
                            }
                            this.showDialogChonItemFromList(true, params)
                        }}
                    />

                    <InputView
                        id={3}
                        isCleared
                        style={[styles.styleInput]}
                        styleTextInputElement={[styles.styleTextInputElement, {
                            height: 100
                        }]}
                        placeholder={"Nhập lý do nghỉ ..."}
                        value={this.textLyDoNghi}
                        blurOnSubmit={true}
                        iconLeft={'parcel-edit'}
                        textTitle={"Lý do nghỉ: "}
                        onChangeText={this.setValueTextInput}
                        multiline
                    />
                </KeyboardAwareScrollView>

                <View style={{ height: 65, justifyContent: 'center' }}>
                    <TouchableOpacity onPress={this.setGuiYeuCau} style={{
                        backgroundColor: configs.colorMain,
                        justifyContent: 'center', alignItems: 'center',
                        borderRadius: 8,
                        elevation: 3,
                        shadowOffset: { width: 0, height: 3 },
                        shadowRadius: 8,
                        shadowOpacity: 0.6,
                        shadowColor: '#000',
                        height: 48,
                        marginHorizontal: 12
                    }}>
                        <Text style={[styles.styleTitle, { color: 'white', fontWeight: 'bold', fontSize: 18 }]}>{'Gửi yêu cầu'}</Text>
                    </TouchableOpacity>
                </View>

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
        borderWidth: 0.5,
        borderRadius: 8,
    },
})

const mapStateToProps = state => ({
    OrderReducer: state.OrderReducer
});

const mapDispatchToProps = (dispatch) => {
    return {
        showLoadding: () => {
            dispatch(actions.showLoading())
        },
        hideLoadding: () => {
            dispatch(actions.hideLoading())
        },
        pushNotifiToAdmin: (params) => {
            api.pushNotifiToAdminNghiPhep(dispatch, params)
        },
        getResonSabbatical: () => {
            api.getResonSabbatical(dispatch)
        },
        createRequestOrder: (params) => {
            api.createRequestOrder(dispatch, params)
        }
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(XinNghiPhepScreen)