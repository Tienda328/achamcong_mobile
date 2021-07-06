import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Text, ScrollView } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView, TextView, DialogSelectItemFromList } from '../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../commons'
import { LocaleConfig, Calendar, Agenda, CalendarList } from 'react-native-calendars';
import { api } from '../../../commons/api/Api';
import { colorDiMuon } from '../../../commons/defined/AppColors';
import DialogDetailDate from './component/DialogDetailDate';
import Popup from '../../components/Dialog';

LocaleConfig.locales['fr'] = {
    monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    monthNamesShort: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
    dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
    dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    today: 'Aujourd\'hui'
};
LocaleConfig.defaultLocale = 'fr';

const keyDiMuonVeSom = 'key1'
const keyDuCong = 'key2'
const keyNghiPhep = 'key3'
const keyNghiKhongLyDo = 'key4'
const keyKhongDuCong = 'key5'
const keyAll = 'key6'

const ListdataSelectFilter = [
    {
        id: 6,
        title: 'Hiển thị tất cả',
        value: keyAll
    },
    {
        id: 1,
        title: 'Đi muộn về sớm',
        value: keyDiMuonVeSom
    },
    {
        id: 2,
        title: 'Đủ công',
        value: keyDuCong
    },
    {
        id: 3,
        title: 'Nghỉ phép',
        value: keyNghiPhep
    },
    {
        id: 4,
        title: 'Nghỉ không lý do',
        value: keyNghiKhongLyDo
    },
    {
        id: 5,
        title: 'Không đủ công',
        value: keyKhongDuCong
    },
]

const icon_menu = require('../../../assets/image/icon_menu.png')
class BaoCaoScreen extends BaseComponent {
    constructor(props) {
        super(props)
        //lưu để chọn ngày hiện tại
        var date = new Date();
        this.state = {
            dataListMarkedDate: {},
            dataSeleteDate: {},
            dataCalendar: {},
            textCheckIn: configs.timeHide1,
            textCheckOut: configs.timeHide1,
            textDayShow: date.getDate() + ' Tháng ' + (date.getMonth() + 1),
            textThu: configs.quyDoiNgayThangSangThu(date.getDate(), (date.getMonth() + 1), date.getFullYear()),
            dataDateFree: 0,

            textSoPhutMuon: '0p',
            textSoPhutSom: '0p',
            textTinhTrang: 0,
            dataTotal: {},
            isShowDialog: false,
            isShowDialogDate: false,

        }
        this.dataDialogDate = {};
        this.onDayPress = this.onDayPress.bind(this)
        this.showDialogChonItemFromList = this.showDialogChonItemFromList.bind(this)
        this.setValueTextInput = this.setValueTextInput.bind(this)
        this.onPressShowFilter = this.onPressShowFilter.bind(this)
        this.reRender = this.reRender.bind(this)
        this.dataDate = []
        this.dataDialogChonItemFromList = []
        this.dataSelectFilter = ListdataSelectFilter[0]
        this.getBaoCaoTongQuan = this.getBaoCaoTongQuan.bind(this)
        this.showDialogDate = this.showDialogDate.bind(this);
    }

    showDialogChonItemFromList(isShow, dataDialog) {
        if (isShow) {
            this.dataDialogChonItemFromList = dataDialog
        }
        this.setState({
            isShowDialog: isShow,
        })
    }

    showDialogDate = (isShow) => {
        this.setState({ isShowDialogDate: isShow });
    };

    setValueTextInput = (id, data) => {
        if (id === '1') {
            this.dataSelectFilter = data
            this.setTimeHistory(this.dataDate, this.state.dataDateFree, this.state.dataTotal)
        }
        // this.reRender()
    }

    reRender = () => {
        this.setState(prevState => ({ reRender: prevState.reRender = !this.state.reRender }))
    }

    getDateMonth(year, month) {
        let paramsHistory = {}
        paramsHistory = {
            date_start: configs.convertTimeDate(new Date(year, month, 1, 0, 0), configs.FORMAT_DATE),
            date_end: configs.convertTimeDate(new Date(year, month + 1, 0, 0, 0), configs.FORMAT_DATE)
        }
        return paramsHistory
    }

    componentDidMount() {
        let now = new Date()
        let params = this.getDateMonth(now.getFullYear(), now.getMonth())
        this.fromDate = params.date_start
        this.toDate = params.date_end
        this.getBaoCaoTongQuan(params)
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.baoCaoTongQuan) {
            if (this.props.baoCaoTongQuan && this.props.baoCaoTongQuan !== prevProps.baoCaoTongQuan) {
                this.conventdata = Object.values(this.props.baoCaoTongQuan)
                let data = Object.values(this.conventdata[0])
                this.setTimeHistory(data)
            }
        }
    }

    getBaoCaoTongQuan = (params) => {
        this.props.getBaoCaoTongQuan(params);
    }

    // getDataHistory = (year, month) => {
    //     this.props.requestDataHistory(this.getDateMonth(year, month))
    // }

    switchFiltter(data, isSelect = false) {
        let weeks = {}
        switch (this.dataSelectFilter.value) {
            case keyAll:
                weeks = this.filterAll(data, isSelect)
                break;
            case keyDiMuonVeSom:
                weeks = this.filterItemDiMuonVeSom(data, isSelect)
                break;
            case keyDuCong:
                weeks = this.filterItemDuCong(data, isSelect)
                break;
            case keyNghiPhep:
                weeks = this.filterItemNghiPhep(data, isSelect)
                break;
            case keyNghiKhongLyDo:
                weeks = this.filterItemNghiKhongLyDo(data, isSelect)
                break;
            case keyKhongDuCong:
                weeks = this.filterItemNghiKhongLyDo(data, isSelect)
                break;

            default:
                break;
        }
        return weeks
    }

    onDayPress(day) {
        let itemList = { [day.dateString]: { selected: true, selectedColor: configs.colorDiSom } }
        let data = this.dataDate.filter(item => item.date === day.dateString)
        
        console.log("---->", data[0])
        if (data[0]) {
            this.dataDialogDate = data[0];
            this.showDialogDate(true);
    
            let weeks = this.switchFiltter(data, true)
            itemList = weeks
    
            let textcheckInLet = data && data[0] && data[0].time_start_timestamp ? data[0].time_start_timestamp : configs.timeHide1
            let textCheckOut = ""
            if (data && data[0] && data[0].time_end_timestamp && (data[0].time_end_timestamp !== textcheckInLet)) {
                textCheckOut = data[0].time_end_timestamp
            } else {
                textCheckOut = configs.timeHide1
            }
            if (day.isNgayHienTai) {
                this.setState({
                    dataSeleteDate: itemList,
                    textCheckIn: textcheckInLet,
                    textCheckOut: textCheckOut,
                    textSoPhutMuon: (data && data[0] && data[0].late ? data[0].late : '0') + 'p',
                    textSoPhutSom: (data && data[0] && data[0].soon ? data[0].soon : '0') + 'p',
                    textTinhTrang: data && data[0] && data[0].state && data[0].state ? data[0].state : 0,
                })
            } else {
                this.setState({
                    textCheckIn: textcheckInLet,
                    textCheckOut: textCheckOut,
                    textSoPhutMuon: (data && data[0] && data[0].late ? data[0].late : '0') + 'p',
                    textSoPhutSom: (data && data[0] && data[0].soon ? data[0].soon : '0') + 'p',
                    textTinhTrang: data && data[0] && data[0].state && data[0].state ? data[0].state : 0,
                    textDayShow: '',
                    dataSeleteDate: itemList,
                    textDayShow: day.day + ' Tháng ' + day.month,
                    textThu: configs.quyDoiNgayThangSangThu(day.day, day.month, day.year)
                });
            }

        } else {
            Popup.show({
                type: 'Warning',
                title: 'Thông báo',
                textBody:
                  'Đây là ngày nghỉ hoặc bạn không có ca nào.',
                button: true,
                buttonCancel: false,
                callback: () => Popup.hide(),
                callbackOk: () => Popup.hide(),
              });
        }
    }

    setTimeHistory(data, dataDateFree, dataTotal) {
        this.dataDate = data
        let dataNow = this.dataDate.filter(item => item.date === configs.valueDate())
        if (dataNow && dataNow[0] && dataNow[0].date) {
            // this.onDayPress({
            //     dateString: dataNow[0].date,
            //     isNgayHienTai: true
            // })
        }

        let weeks = this.switchFiltter(data)

        let textCheckIn = dataNow && dataNow[0] && dataNow[0].time_start_timestamp ? dataNow[0].time_start_timestamp : configs.timeHide1
        this.setState({
            dataCalendar: weeks,
            textCheckIn: dataNow && dataNow[0] && dataNow[0].time_start_timestamp ? dataNow[0].time_start_timestamp : configs.timeHide1,
            textCheckOut: dataNow && dataNow[0] && dataNow[0].time_end_timestamp !== textCheckIn ? dataNow[0].time_end_timestamp : configs.timeHide1,
            dataDateFree: dataDateFree,
            dataTotal: dataTotal
        })
    }

    filterItemDiMuonVeSom(data, isSelect = false) {
        let weeks = {}
        //đi muộn or về sớm
        if (isSelect) {
            let color = 'black'
            if ((data[0].late && data[0].late > 0) || (data[0].soon && data[0].soon > 0)) {
                color = configs.colorDiMuon
            }
            weeks = {
                [data[0].date]: {
                    customStyles: {
                        container: {
                            backgroundColor: '#99ccff',
                            elevation: 2
                        }, text: { color: color, fontWeight: 'bold' }
                    }
                }
            }
        } else {
            for (let i = 0; i < data.length; i++) {
                if ((data[i].late && data[i].late > 0) || (data[i].soon && data[i].soon > 0)) {
                    //đi muộn or về sớm
                    weeks = {
                        ...{
                            [data[i].date]: { customStyles: { text: { color: configs.colorDiMuon, fontWeight: 'bold', fontSize: 18 } } }
                        }, ...weeks
                    }
                }
            }
        }
        return weeks
    }

    filterItemDuCong(data, isSelect = false) {
        let weeks = {}
        //đủ công
        if (isSelect) {
            let color = 'black'
            if (data[0].remain === 0 && data[0].shift && data[0].shift !== 0) {
                color = configs.colorDuCong
            }
            weeks = {
                [data[0].date]: {
                    customStyles: {
                        container: {
                            backgroundColor: '#99ccff',
                            elevation: 2
                        }, text: { color: color, fontWeight: 'bold' }
                    }
                }
            }
        } else {
            for (let i = 0; i < data.length; i++) {
                if (data[i].remain === 0 && data[i].shift && data[i].shift !== 0) {
                    //đủ công
                    weeks = {
                        ...{
                            [data[i].date]: { customStyles: { text: { color: configs.colorDuCong, fontWeight: 'bold', fontSize: 18 } } }
                        }, ...weeks
                    }
                }
            }
        }
        return weeks
    }

    filterItemNghiPhep(data, isSelect = false) {
        let weeks = {}
        if (isSelect) {
            let color = 'black'
            if (data[0].shift_free > 0) {
                color = configs.colorNghiPhep
            }
            weeks = {
                [data[0].date]: {
                    customStyles: {
                        container: {
                            backgroundColor: '#99ccff',
                            elevation: 2
                        }, text: { color: color, fontWeight: 'bold' }
                    }
                }
            }
        } else {
            for (let i = 0; i < data.length; i++) {
                if (data[i].shift_free > 0) {
                    weeks = {
                        ...{
                            [data[i].date]: { customStyles: { text: { color: configs.colorNghiPhep, fontWeight: 'bold', fontSize: 18 } } }
                        }, ...weeks
                    }
                }
            }
        }
        return weeks
    }

    filterItemNghiKhongLyDo(data, isSelect = false) {
        let weeks = {}
        if (isSelect) {
            let color = 'black'
            if (data[0].shift_valid !== 0 && data[0].remain !== 0 && (data[0].shift_valid === data[0].remain)) {
                color = configs.colorNgayNghi
            }
            weeks = {
                [data[0].date]: {
                    customStyles: {
                        container: {
                            backgroundColor: '#99ccff',
                            elevation: 2
                        }, text: { color: color, fontWeight: 'bold' }
                    }
                }
            }
        } else {
            for (let i = 0; i < data.length; i++) {
                if (data[i].shift_valid !== 0 && data[i].remain !== 0 && (data[i].shift_valid === data[i].remain)) {
                    weeks = {
                        ...{
                            [data[i].date]: { customStyles: { text: { color: configs.colorNgayNghi, fontWeight: 'bold', fontSize: 18 } } }
                        }, ...weeks
                    }
                }
            }
        }
        return weeks
    }

    filterKhongDuCong(data, isSelect = false) {
        let weeks = {}
        if (isSelect) {
            let color = 'black'
            if (data[0].remain > 0 && data[0].time_start_timestamp) {
                color = configs.colorNgayNghi
            }
            weeks = {
                [data[0].date]: {
                    customStyles: {
                        container: {
                            backgroundColor: '#99ccff',
                            elevation: 2
                        }, text: { color: color, fontWeight: 'bold' }
                    }
                }
            }
        } else {
            for (let i = 0; i < data.length; i++) {
                if (data[i].remain > 0 && data[i].time_start_timestamp) {
                    weeks = {
                        ...{
                            [data[i].date]: { customStyles: { text: { color: configs.colorNgayNghi, fontWeight: 'bold', fontSize: 18 } } }
                        }, ...weeks
                    }
                }
            }
        }
        return weeks
    }

    filterAll(data, isSelect = false) {
        //isSelect dung phan biet nó la chon hay hien thi
        let weeks = {}
        if (isSelect) {
            weeks = {
                [data[0].date]: {
                    customStyles: {
                        container: {
                            backgroundColor: '#99ccff',
                            elevation: 2
                        }, text: { color: this.getColor(data[0]), fontWeight: 'bold' }
                    }
                }
            }
        } else {
            for (let i = 0; i < data.length; i++) {
                let color = this.getColor(data[i])
                weeks = {
                    ...{
                        [data[i].date]: { customStyles: { text: { color: color } } }
                    }, ...weeks
                }
            }

        }
        return weeks
    }

    getColor(data) {
        let color = 'black'
        if (data.shift_valid !== 0 && data.remain !== 0 && (data.shift_valid === data.remain)) {
            //ngày nghỉ
            color = configs.colorNgayNghi
        } else if (data.remain > 0 && data.time_start_timestamp) {
            //không đủ công
            color = configs.colorThieuCong
        } else if (data.shift_free > 0) {
            //nghi phep
            color = configs.colorNghiPhep
        } else if (data.add_shift) {
            //Tăng ca
            color = configs.colorTangCa
        } else if ((data.late && data.late > 0) || (data.soon && data.soon > 0)) {
            //đi muộn or về sớm
            color = configs.colorDiMuon
        } else if (data.remain === 0 && data.shift && data.shift !== 0) {
            //đủ công
            color = configs.colorDiSom
        } else {
            // console.log(JSON.stringify(data))
        }

        return color
    }

    onPressShowFilter = () => {
        let params = {
            title: 'Chọn loại bạn muốn lọc',
            id: '1',
            itemSelect: this.dataSelectFilter ? this.dataSelectFilter.id : null,
            dataList: ListdataSelectFilter,
        }
        this.showDialogChonItemFromList(true, params)
    }

    drawGhiChu() {
        return (
            <View style={{ flexDirection: 'row', marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 6 }}>
                    <View style={{
                        backgroundColor: configs.colorDiMuon,
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        marginRight: 4
                    }} />
                    <Text style={[styles.styleTitleChuThich]}>{'Đi muộn hoặc về sớm'}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 6 }}>
                    <View style={{
                        backgroundColor: configs.colorDiSom,
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        marginRight: 4
                    }} />
                    <Text style={[styles.styleTitleChuThich]}>{'Đủ công'}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 6 }}>
                    <View style={{
                        backgroundColor: configs.colorNghiPhep,
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        marginRight: 8
                    }} />
                    <Text style={[styles.styleTitleChuThich]}>{'Nghỉ phép'}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 6 }}>
                    <View style={{
                        backgroundColor: configs.colorNgayNghi,
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        marginRight: 8
                    }} />
                    <Text style={[styles.styleTitleChuThich]}>{'Nghỉ không lý do'}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 6 }}>
                    <View style={{
                        backgroundColor: configs.colorThieuCong,
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        marginRight: 4
                    }} />
                    <Text style={[styles.styleTitleChuThich]}>{'Không đủ công'}</Text>
                </View>
            </View>
        )
    }

    render() {
        this.conventdata = Object.values(this.props.baoCaoTongQuan)
        this.conventdatasheet = Object.values(this.conventdata[0])
        this.detailTotalSheet = this.conventdatasheet[this.conventdatasheet.length - 1]
        let { dataDateFree, textSoPhutMuon, textSoPhutSom, dataTotal } = this.state;
        return (
            <BaseView stylesView={{ flex: 1, backgroundColor: 'white' }}
                titleScreen={"Kiểm tra checkin"}
                subTitle={'havantam.it@gmail.com'}
                styleToolbar={{ height: 45 }}
                styleTitle={[styles.styleTitle]}
                styleTitleToolbarBase={styles.styleTitleToolbarBase}
                drawIconLeft={
                    <TouchableOpacity style={[styles.styleViewIconLeftBase]}
                        onPress={this.props.handleMenu}>
                        {/* <Image
                            source={icon_menu}
                            style={{ justifyContent: 'center', alignItems: 'center', width: 30, height: 30, tintColor: 'black' }}
                        /> */}

                        <IconView
                            style={{ justifyContent: 'center', alignItems: 'center', }}
                            color='black'
                            name={"left-arrow"}
                            size={configs.sizeIcon20}
                            height={configs.sizeIcon20}
                        />
                    </TouchableOpacity>
                }
            >

                <ScrollView>
                    <View style={styles.styleViewCheckView}>
                        <View style={[styles.styleViewCheck, { borderRightWidth: 1, borderRightColor: configs.colorBorder }]}>
                            <Text style={[styles.styleTitle, { color: '#009933', fontSize: 18, fontWeight: 'bold' }]}>
                                {(this.detailTotalSheet && this.detailTotalSheet.shift ? this.detailTotalSheet.shift : '0') + '/' + (this.detailTotalSheet && this.detailTotalSheet.total_shift ? this.detailTotalSheet.total_shift : '0')}
                            </Text>
                            <Text style={[styles.styleTitle, { fontSize: 13 }]}>{'Ngày công'}</Text>
                        </View>
                        <View style={[styles.styleViewCheck, { borderRightWidth: 1, borderRightColor: configs.colorBorder }]}>
                            <Text style={[styles.styleTitle, { color: '#ff9900', fontSize: 18, fontWeight: 'bold' }]}>{this.detailTotalSheet && this.detailTotalSheet.shift_not_free ? this.detailTotalSheet.shift_not_free + '' : '0'}</Text>
                            <Text style={[styles.styleTitle, { fontSize: 13 }]}>{'Nghỉ không công'}</Text>
                        </View>
                        <View style={styles.styleViewCheck}>
                            <Text style={[styles.styleTitle, { color: configs.colorDiMuon, fontSize: 18, fontWeight: 'bold' }]}>{this.detailTotalSheet && this.detailTotalSheet.shift_valid ? this.detailTotalSheet.shift_valid + '' : '0'}</Text>
                            <Text style={[styles.styleTitle, { fontSize: 13 }]}>{'Nghỉ làm'}</Text>
                        </View>
                    </View>

                    <View style={[styles.styleViewCheckView, { flexDirection: 'column', marginTop: 0, paddingHorizontal: 12, paddingVertical: 0 }]}>
                        <View style={styles.styleViewChiTiet}>
                            <Text style={[styles.styleTitle, { flex: 1 }]}>{'- Số ngày phép còn lại trong năm'}</Text>
                            <Text style={[styles.styleTitle, { fontWeight: 'bold' }]}>{dataDateFree ? dataDateFree + '' : ''}</Text>
                        </View>
                        <View style={styles.styleViewChiTiet}>
                            <Text style={[styles.styleTitle, { flex: 1 }]}>{'- Tổng số phút đi muộn và về sớm'}</Text>
                            <Text style={[styles.styleTitle, { fontWeight: 'bold' }]}>{(this.detailTotalSheet && this.detailTotalSheet.late_soon ? this.detailTotalSheet.late_soon + '' : '0') + ' p'}</Text>
                        </View>
                        <View style={[styles.styleViewChiTiet]}>
                            <Text style={[styles.styleTitle, { flex: 1 }]}>{'- Lượt quên chấm công'}</Text>
                            <Text style={[styles.styleTitle, { fontWeight: 'bold' }]}>{(this.detailTotalSheet && this.detailTotalSheet.shift_miss_checkin ? this.detailTotalSheet.shift_miss_checkin + '' : '0')}</Text>
                        </View>
                        <View style={[styles.styleViewChiTiet, { borderBottomWidth: 0 }]}>
                            <Text style={[styles.styleTitle, { flex: 1 }]}>{'- Nghỉ không lý do'}</Text>
                            <Text style={[styles.styleTitle, { fontWeight: 'bold' }]}>{(this.detailTotalSheet && this.detailTotalSheet.shift_valid ? this.detailTotalSheet.shift_valid + '' : '0')}</Text>
                        </View>
                    </View>


                    <View style={{
                        padding: 12,
                        borderTopWidth: 1,
                        borderTopColor: configs.colorBorder,
                        marginTop: 12,
                        flexDirection: 'row'
                    }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18 }}> {'Lịch Checkin'}</Text>
                            <Text style={{ color: configs.colorText, marginTop: 4 }}> {'Chọn ngày để xem checkin'}</Text>
                        </View>

                        <IconView
                            onPress={this.onPressShowFilter}
                            name={'filter'}
                            size={20}
                            color={configs.colorMain}
                            style={{ padding: 8 }}
                        />
                    </View>

                    <Calendar
                        markingType={'custom'}
                        markedDates={{
                            ...this.state.dataCalendar, ...this.state.dataSeleteDate
                        }}
                        onDayPress={(day) => this.onDayPress(day)}
                        onMonthChange={({month, year}) => {

                            // console.log("------|||",{month, year});
                            // let date_start = new Date(year, month - 1, 2);
                            // let date_end = new Date(year, month, 1);
                            let date_start = new Date(year, month - 1, 1);
                            let date_end = new Date(year, month, 0);

                            // console.log({
                            //     date_start,
                            //     date_end
                            // })
                            
                            let params = {
                                date_start: configs.convertTimeDate(date_start, configs.FORMAT_DATE),
                                date_end: configs.convertTimeDate(date_end, configs.FORMAT_DATE)
                            }

                            // console.log({params})
                            this.getBaoCaoTongQuan(params)
                        }}
                    />

                    {this.drawGhiChu()}
                </ScrollView>
                <DialogDetailDate
                    isShowDialog={this.state.isShowDialogDate}
                    showDialog={this.showDialogDate}
                    data={this.dataDialogDate}
                />
                <DialogSelectItemFromList
                    isShowDialog={this.state.isShowDialog}
                    dataDialog={this.dataDialogChonItemFromList}
                    showDialog={this.showDialogChonItemFromList}
                    onDataSelectItem={this.setValueTextInput} />
            </BaseView>
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
    styleViewCheck: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styleViewCheckView: {
        flexDirection: 'row',
        borderRadius: 8,
        margin: 12,
        elevation: 1,
        shadowColor: configs.colorText,
        shadowOpacity: 0.5,
        shadowOffset: {
            height: 1,
            width: 2
        },
        backgroundColor: 'white',
        paddingVertical: 12,
    },
    styleTextThu: {
        color: 'black',
        fontFamily: 'Lato-Regular',
        fontSize: configs.fontSize16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    styleViewChiTiet: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: configs.colorBorder,
        flexDirection: 'row'
    },
    styleTitleChuThich: {
        fontSize: 10, fontStyle: 'italic'
    }
})

const mapStateToProps = (state) => ({
    baoCaoTongQuan: state.BaoCaoReducer,
});


const mapDispatchToProps = (dispatch) => {
    return {
        showLoadding: () => {
            dispatch(actions.showLoading())
        },
        getBaoCaoTongQuan: (params) => {
            api.getBaoCaoTongQuan(dispatch, params)
        },
        hideLoadding: () => {
            dispatch(actions.hideLoading())
        },
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(BaoCaoScreen)