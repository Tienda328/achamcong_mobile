import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Text, Platform } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView, InputView, RadioForm, DialogSelectItemFromList } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { models } from '../../../../commons/model';
import { actions } from '../../../../commons/action';
import { api } from '../../../../commons/api/Api';
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

        this.dataSeleLoaiNghi = {}
        this.dataSelectTimeStart = {}
        this.dataSelectTimeEnd = {}
        this.dataLogin = models.getDataLogin()
        this.dataReason = []

        this.indexPickerDate = 0;
        this.detail = {}
        this.blook = []
        this.blook1 = []
        this.ishowInputView1 = false
        this.ishowInputView2 = false

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
        console.log("date:     " + date)
        let valueDate = configs.convertTimeDate(date, configs.FORMAT_DATE)
        if (this.indexPickerDate === 0) {
            this.dateNgayNghi = date
        } else if (this.indexPickerDate === 1) {
            if (this.toDate && configs.checkDateAfterDate1(valueDate, this.toDate, configs.FORMAT_DATE, configs.FORMAT_DATE) === 1) {
                setTimeout(() => {
                    configs.showAlert("Từ ngày không được lớn hơn hoặc bằng Đến ngày")
                }, 500);
            } else {
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
            }
        } else {
            if (this.fromDate && configs.checkDateAfterDate1(this.fromDate, date, configs.FORMAT_DATE, configs.FORMAT_DATE) === 1) {
                setTimeout(() => {
                    configs.showAlert("Từ ngày không được lớn hơn hoặc bằng Đến ngày")
                }, 500);
            } else {
                this.toDate = date
            }
        }
        this.showPickerDate(this.indexPickerDate, false)
    }

    showPickerDate = (indexPickerDate, isShow = true) => {
        this.indexPickerDate = indexPickerDate;
        if (this.indexPickerDate == 1) {
            this.ishowInputView1 = true
            this.dataSelectTimeStart = {}
        }
        else {
            this.ishowInputView2 = true
            this.dataSelectTimeEnd = {}
        }
        this.setState((state) => ({
            isShowPickerDate: (state.isShowPickerDate = isShow),
        }));
    };


    setValueTextInput = (id, data) => {
        if (id === "timeStart") {
            this.dataSelectTimeStart = data
        } else if (id === "timeEnd") {
            this.dataSelectTimeEnd = data
        }

        this.reRender()
    }

    setDataReason(data) {
        this.dataReason = data
    }

    setGuiYeuCau() {
        //type =1: xin nghỉ nửa ngày, type=2, 3: xin nghỉ nhiều ngày 
        if (this.toDate === '') {
            configs.showAlert("Bạn không được bỏ trống 'Đến ngày'")
        } else if (this.fromDate === '') {
            configs.showAlert("Bạn không được bỏ trống 'Từ ngày'")
        } else if (!this.dataSelectTimeStart.id) {
            configs.showAlert('Bạn cần chọn thời gian bắt đầu nghỉ')
        } else if (!this.dataSelectTimeEnd.id) {
            configs.showAlert('Bạn cần chọn thời gian kết thúc nghỉ')
        } else {
            let toDateDisplay = (this.toDate && configs.convertTimeDate(this.toDate, configs.FORMAT_DATE) || "") + ' ' + this.dataSelectTimeEnd.title + ':00'
            let fromDateDisplay = (this.fromDate && configs.convertTimeDate(this.fromDate, configs.FORMAT_DATE) || "") + ' ' + this.dataSelectTimeStart.title + ':00'
            let params = {
                time_start: fromDateDisplay,
                time_end: toDateDisplay,
                state: 2,
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
        let toDateDisplay = this.toDate && configs.convertTimeDate(this.toDate, configs.FORMAT_DATE) || ""
        let dateShow = this.indexPickerDate === 1 ? this.fromDate : (this.indexPickerDate === 2 ? this.toDate : this.dateNgayNghi)

        return (
            <View style={{ flex: 1 }}>
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <InputView
                            id={1}
                            isRequired={true}
                            onPressText={(id, value) => {
                                this.showPickerDate(1, true)
                            }}
                            isCleared
                            multiline
                            editable={false}
                            style={[styles.styleInput, { flex: 5 }]}
                            styleTextInputElement={[styles.styleTextInputElement, {
                            }]}
                            styleInput={{
                            }}
                            placeholder={"Từ ngày..."}
                            value={fromDateDisplay}
                            iconLeft={'calendar'}
                            textTitle={"Từ ngày: "}
                            onChangeText={(id, value) => {
                                if (value === '') {
                                    this.fromDate = ''
                                    this.reRender()
                                }
                            }}
                        />
                        {this.ishowInputView1 ?
                            <InputView
                                isCleared={false}
                                editable={false}
                                isRequired={true}
                                style={[styles.styleInput, { flex: 3, marginLeft: 12 }]}
                                styleTextInputElement={[styles.styleTextInputElement]}
                                placeholder={"t/g bắt đầu nghỉ"}
                                value={this.dataSelectTimeStart.title}
                                blurOnSubmit={true}
                                iconLeft={'calendar-time'}
                                textTitle={"t/g bắt đầu nghỉ: "}
                                onChangeText={this.setValueTextInput}
                                onPressText={() => {
                                    this.data = this.props.listBlockCa.detail.forEach(element => {
                                        this.blook = element[0]
                                    });
                                    let params = {
                                        title: 'Chọn thời gian bắt đầu nghỉ',
                                        id: 'timeStart',
                                        itemSelect: this.dataSelectTimeStart ? this.dataSelectTimeStart.id : null,
                                        dataList: this.blook.map((el, index) => {
                                            let object = {
                                                id: index + 1,
                                                title: `${configs.quyDoiTimStampToGio(el.time_start)}`,
                                                value: index + 1,
                                            };
                                            return object;
                                        }),
                                    }
                                    this.showDialogChonItemFromList(true, params)
                                }}
                            /> : null
                        }

                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <InputView
                            id={2}
                            isRequired={true}
                            isCleared
                            onPressText={(id, value) => {
                                this.showPickerDate(2, true)
                            }}
                            multiline
                            editable={false}
                            style={[styles.styleInput, { flex: 5 }]}
                            styleTextInputElement={[styles.styleTextInputElement, {
                            }]}
                            styleInput={{
                            }}
                            placeholder={"Đến ngày..."}
                            value={toDateDisplay}
                            iconLeft={'calendar'}
                            textTitle={"Đến ngày: "}
                            onChangeText={(id, value) => {
                                if (value === '') {
                                    this.toDate = ''
                                    this.reRender()
                                }
                            }}
                        />
                        {this.ishowInputView2 ?
                            <InputView
                                isCleared={false}
                                editable={false}
                                isRequired={true}
                                style={[styles.styleInput, { flex: 3, marginLeft: 12 }]}
                                styleTextInputElement={[styles.styleTextInputElement]}
                                placeholder={"t/g kết thúc nghỉ"}
                                value={this.dataSelectTimeEnd.title}
                                blurOnSubmit={true}
                                iconLeft={'calendar-time'}
                                textTitle={"t/g kết thúc nghỉ: "}
                                onChangeText={this.setValueTextInput}
                                onPressText={() => {
                                    this.data = this.props.listBlockCa.detail.forEach(element => {
                                        this.blook = element[0]
                                    });
                                    let params = {
                                        title: 'Chọn thời gian bắt đầu nghỉ',
                                        id: 'timeEnd',
                                        itemSelect: this.dataSelectTimeStart ? this.dataSelectTimeStart.id : null,
                                        dataList: this.blook.map((el, index) => {
                                            let object = {
                                                id: index + 1,
                                                title: `${configs.quyDoiTimStampToGio(el.time_end)}`,
                                                value: index + 1,
                                            };
                                            return object;
                                        }),
                                    }
                                    this.showDialogChonItemFromList(true, params)
                                }}
                            /> : null
                        }
                    </View>
                </View>

                <DateTimePickerModal
                    isVisible={this.state.isShowPickerDate}
                    mode={'date'}
                    locale={'vi'}
                    date={dateShow ? new Date(dateShow) : new Date()}
                    confirmTextIOS='Thay Đổi'
                    cancelTextIOS='Hủy'
                    titleIOS={this.indexPickerDate === 1 ? "Chọn từ ngày" : (this.indexPickerDate === 2 ? "Chọn đến ngày" : "Chọn ngày nghỉ")}
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
        // marginRight: 10,
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