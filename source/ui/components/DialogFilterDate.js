import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from 'react-native-simple-toast';
import { commonsConfigs as configs } from '../../commons';
import { BaseDiaLog, IconView, RadioForm, TextView } from '../components';

export default class DialogFilterDate extends Component {

    constructor(props) {
        super(props)
        this.indexSelected = configs.FILTER_TO_DAY.index
        this.initFilterDate()
        this.state = {
            reRender: false,
            isShowPickerDate: false,
        }
        this.applyFilterParcel = this.applyFilterParcel.bind(this)
        this.showPickerDate = this.showPickerDate.bind(this)
        this.handleSelectedPickerDate = this.handleSelectedPickerDate.bind(this)

    }

    initFilterDate = () => {
        // let filterDate = models.getDataFilterDate(this.typeFilter)
        // this.TodaySelectedFromStatisticScreen ? this.indexSelected = 0 :this.indexSelected = filterDate.indexSelected;
        // this.fromDate = filterDate.fromDate
        // this.LoaiNgayThongKe = filterDate.LoaiNgayThongKe
        // if (this.indexSelected === configs.FILTER_OPTION.index) {
        //     this.toDate = filterDate.toDate
        // } else {
        this.toDate = configs.dateTimeNowFormat(configs.FORMAT_DATE)
        if (this.indexSelected === configs.FILTER_TO_DAY.index) {
            this.fromDate = configs.dateTimeNowFormat(configs.FORMAT_DATE)
        } else if (this.indexSelected === configs.FILTER_LAST_7_DAY.index) {
            this.fromDate = configs.dateTimeLast7DayFormat(configs.FORMAT_DATE)
        } else if (this.indexSelected === configs.FILTER_LAST_30_DAY.index) {
            this.fromDate = configs.dateTimeLast30DayFormat(configs.FORMAT_DATE)
        } else if (this.indexSelected === configs.FILTER_LAST_90_DAY.index) {
            this.fromDate = configs.dateTimeLast90DayFormat(configs.FORMAT_DATE)
        }
        // }
        // let dataFilterSave = {
        //     indexSelected: this.indexSelected,
        //     fromDate: this.fromDate,
        //     toDate: this.toDate,
        //     LoaiNgayThongKe: this.LoaiNgayThongKe
        // }
        // models.saveFilterDate(this.typeFilter, dataFilterSave)
    }

    reRender = () => {
        this.setState(prevState => ({ reRender: prevState.reRender = !this.state.reRender }))
    }

    showPickerDate = (indexPickerDate, isShow) => {
        if (this.indexSelected === configs.FILTER_OPTION.index) {
            this.indexPickerDate = indexPickerDate
        }
        this.setState(state => ({ isShowPickerDate: state.isShowPickerDate = isShow }))
    }

    handleSelectedDateFileter = (index, itemSelected) => {
        let isShowPicker = false
        this.indexSelected = itemSelected.index
        this.toDate = configs.dateTimeNowFormat(configs.FORMAT_DATE)
        if (this.indexSelected === configs.FILTER_TO_DAY.index) {
            this.fromDate = configs.dateTimeNowFormat(configs.FORMAT_DATE)
            isShowPicker = false
        } else if (this.indexSelected === configs.FILTER_LAST_7_DAY.index) {
            this.fromDate = configs.dateTimeLast7DayFormat(configs.FORMAT_DATE)
            isShowPicker = false
        } else if (this.indexSelected === configs.FILTER_LAST_30_DAY.index) {
            this.fromDate = configs.dateTimeLast30DayFormat(configs.FORMAT_DATE)
            isShowPicker = false
        } else if (this.indexSelected === configs.FILTER_LAST_90_DAY.index) {
            this.fromDate = configs.dateTimeLast90DayFormat(configs.FORMAT_DATE)
            isShowPicker = false
        } else if (this.indexSelected === configs.FILTER_OPTION.index) {
            this.indexPickerDate = 1
            this.fromDate = ''
            this.toDate = ''
            isShowPicker = true
        }
        this.showPickerDate(this.indexPickerDate, isShowPicker)
    }

    handleSelectedLoaiNgayThongKe = (index, itemSelected) => {
        this.LoaiNgayThongKe = itemSelected.index
    }

    handleSelectedPickerDate = (date) => {
        let valueDate = configs.convertTimeDate(date, configs.FORMAT_DATE)
        if (configs.checkDateAfterDateNow(valueDate) === 1 && !this.props.isSSDate) {
            Toast.show("Ngày chọn không được lớn hơn ngày hiện tại")
            if (this.indexPickerDate === 1) {
                this.fromDate = configs.dateTimeNowFormat(configs.FORMAT_DATE)
            } else {
                this.toDate = configs.dateTimeNowFormat(configs.FORMAT_DATE)
            }
        } else {
            if (this.indexPickerDate === 1) {
                if (this.toDate && configs.checkDateAfterDate(valueDate, this.toDate, configs.FORMAT_DATE, configs.FORMAT_DATE) === 1) {
                    Toast.show("Từ ngày không được lớn hơn Đến ngày")
                } else {
                    this.fromDate = valueDate
                }
            } else {
                if (this.fromDate && configs.checkDateAfterDate(this.fromDate, valueDate, configs.FORMAT_DATE, configs.FORMAT_DATE) === 1) {
                    Toast.show("Từ ngày không được lớn hơn Đến ngày")
                } else {
                    this.toDate = valueDate
                }
            }
        }
        this.showPickerDate(this.indexPickerDate, false)
    }

    applyFilterParcel = () => {
        if (!this.fromDate || !this.toDate) {
            Toast.show("Ngày tháng không được để trống")
        } else {
            this.props.closedDialog(2, false)
            this.props.applyResponses(this.toDate, this.fromDate)
        }
    }

    render() {
        let { isShowDialog, closedDialog, requestOrder } = this.props
        let dateShow = this.indexPickerDate === 1 ? this.fromDate : this.toDate
        let fromDateDisplay = this.fromDate && configs.convertTimeDate(this.fromDate, configs.FORMAT_DATE_VN) || ""
        let toDateDisplay = this.toDate && configs.convertTimeDate(this.toDate, configs.FORMAT_DATE_VN) || ""
        return (
            <BaseDiaLog
                //truyền true để hiển thị dialog, và ngược lại
                isIconClosed
                visibleModal={isShowDialog}
                closedDialog={() => closedDialog(2, false)}
                titleDialog={"Bộ lọc tìm kiếm"}
            >
                <View style={{
                    flexDirection: 'column',
                    borderTopWidth: 0.5,
                    borderColor: configs.colorBorder,
                }}>
                    <RadioForm
                        radio_props={configs.DateOptionsFilterData}
                        initial={this.indexSelected}
                        borderWidth={0}
                        labelStyle={{
                            flex: 1,
                            marginRight: 25,
                            fontSize: configs.fontSize14,
                        }}
                        radioWrap={{
                            alignContent: 'center',
                            justifyContent: 'center',
                            marginLeft: 25,
                            marginBottom: 5,
                            paddingVertical: 5,
                        }}
                        style={{
                            marginTop: configs.marginTop10,
                        }}
                        onPress={this.handleSelectedDateFileter}
                    />
                    <View style={{
                        flexDirection: 'row',
                        marginLeft: configs.marginLeft15,
                        marginRight: configs.marginRight15,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingBottom: configs.paddingBottom15,
                        borderBottomWidth: 0.5,
                        borderColor: configs.colorBorder,
                    }}>
                        <TextView
                            onPress={() => this.showPickerDate(1, this.indexSelected === configs.DateOptionsFilterData[4].index)}
                            style={styles.styleContainerDate}
                            styleValue={{ fontWeight: '500', fontSize: configs.fontSize14 }}
                            value={fromDateDisplay}
                            stylesIconLeft={styles.stylesIconLeft}
                            iconLeft={'calendar'}
                            iconColor={configs.colorMain}
                            iconSize={configs.sizeIcon14}
                        />
                        <IconView
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginLeft: configs.marginLeft15,
                                marginRight: configs.marginRight15
                            }}
                            color='#000000'
                            name={"arrow-right"}
                            size={configs.sizeIcon18}
                        />

                        <TextView
                            onPress={() => this.showPickerDate(2, this.indexSelected === configs.DateOptionsFilterData[4].index)}
                            style={styles.styleContainerDate}
                            styleValue={{ fontWeight: '500', fontSize: configs.fontSize14 }}
                            value={toDateDisplay}
                            stylesIconLeft={styles.stylesIconLeft}
                            iconLeft={'calendar'}
                            iconColor={configs.colorMain}
                            iconSize={configs.sizeIcon14}
                        />
                    </View>
                    <TextView
                        onPress={() => this.applyFilterParcel()}
                        style={styles.styleButton}
                        styleValue={{ color: 'white', fontWeight: '500', fontSize: configs.fontSize14 }}
                        value={"Áp Dụng"}
                    />

                    <DateTimePickerModal
                        isVisible={this.state.isShowPickerDate}
                        mode={'date'}
                        locale={'vi'}
                        date={dateShow ? new Date(dateShow) : new Date()}
                        confirmTextIOS='Thay Đổi'
                        cancelTextIOS='Hủy'
                        titleIOS={this.indexPickerDate === 1 ? "Chọn từ ngày" : "Chọn đến ngày"}
                        onConfirm={this.handleSelectedPickerDate}
                        onCancel={() => this.showPickerDate(this.indexPickerDate, false)}
                    />
                </ View>
            </BaseDiaLog>
        )
    }

}

const styles = StyleSheet.create({

    stylesHeader: {
        backgroundColor: 'white',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: configs.borderRadius4,
        borderBottomWidth: 0.5,
        borderColor: configs.colorBorder,
    },

    styleButton: {
        backgroundColor: configs.colorMain,
        height: configs.heightInput40,
        borderColor: configs.colorMainDaiMau2,
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        paddingVertical: 12,
        margin: configs.margin15
    },

    //style dialog filter
    styleContainerDate: {
        flex: 1,
        paddingLeft: configs.paddingLeft,
        borderWidth: 0.5,
        borderRadius: configs.borderRadius4,
        borderColor: '#5C6979',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
    },

    stylesIconLeft: {
        width: configs.widthIconInput,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: configs.borderRadius4,
        borderBottomLeftRadius: configs.borderRadius4,
        color: configs.colorIcon,
    },

})
