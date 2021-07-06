import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Animated, Dimensions, Text, BackHandler } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView, TextView, DialogSelectItemFromList, InputView } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'
import { BarChart, PieChart, LineChart } from 'react-native-chart-kit'
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { api } from '../../../../commons/api/Api';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-simple-toast";
import { actions } from '../../../../commons/action';
import { models } from '../../../../commons/model';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const screenWidth = Dimensions.get("window").width;

const dataQuenChamCong = [
    {
        id: 1,
        title: 'Quên check in',
        value: 1
    },
    {
        id: 2,
        title: 'Quên check out',
        value: 2
    },
]

class QuenChamCongScreen extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            reRender: false,
            isShowDialog: false,
            isShowPickerDate: false
        }
        this.dataLogin = models.getDataLogin()
        this.dataLoaiQuenChamCong = []
        this.dateQuenChamCong = new Date()
        this.toTime = new Date()
        this.showDialogChonItemFromList = this.showDialogChonItemFromList.bind(this)
        this.setValueTextInput = this.setValueTextInput.bind(this)
        this.showPickerDate = this.showPickerDate.bind(this)
        this.setGuiYeuCau = this.setGuiYeuCau.bind(this)
        this.handleSelectedPickerDate = this.handleSelectedPickerDate.bind(this)
        this.textLyDoQuen = ''
        this.indexPickerDate = 0

        this.showInputView = false
        this.showInputView1 = false
        this.dataSeleLoaiCaNghi = {}
        this.getListBlookCa = this.getListBlookCa.bind(this)

    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backPressed);
    }

    getListBlookCa = (params) => {
        this.props.getListBlookCa(params);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    }

    showDialogChonItemFromList(indexDialog, isShow, dataDialog) {
        if (isShow) {
            if (indexDialog == 2) {
                this.showInputView1 = true
                this.dataDialogChonItemFromList = dataDialog
            }
            this.dataDialogChonItemFromList = dataDialog
        }
        this.setState({
            isShowDialog: isShow,
        })
    }

    setValueTextInput = (id, data) => {
        if (id === 'LoaiQuenChamCong') {
            this.dataLoaiQuenChamCong = data
        } else if (id === 2) {
            this.textTitleQuenCC = data
        } else if (id === 3) {
            this.textLyDoQuen = data
        } else if (id === '4') {
            this.dataSeleLoaiCaNghi = data
        }
        this.reRender()
    }

    showPickerDate = (indexPickerDate, isShow = true) => {
        this.indexPickerDate = indexPickerDate
        if (this.indexPickerDate == 1) {
            this.dataSeleLoaiCaNghi = {}
            this.showInputView = true
        }
        this.setState(state => ({ isShowPickerDate: state.isShowPickerDate = isShow }))
    }

    handleSelectedPickerDate = (date) => {
        if (this.indexPickerDate === 2) {
            this.toTime = date
        } else if (this.indexPickerDate === 1) {
            this.dateQuenChamCong = date
            this.fromDate = date
            let dateStart = (this.fromDate && configs.convertTimeDate(this.fromDate, configs.FORMAT_DATE) || "")
            let dateEnd = (this.fromDate && configs.convertTimeDate(this.fromDate, configs.FORMAT_DATE) || "")
            let params = {
                date_start: dateStart,
                date_end: dateEnd,
            }
            this.getListBlookCa(params)
        }
        this.showPickerDate(this.indexPickerDate, false)
    }

    setGuiYeuCau = () => {
        if (!this.dataLoaiQuenChamCong || !this.dataLoaiQuenChamCong.id) {
            Toast.show("Bạn cần chọn loại bạn quên chấm công.")
        } else if (!this.dateQuenChamCong) {
            Toast.show("Bạn cần chọn ngày bạn quên chấm công.")
        } else if (!this.textTitleQuenCC || this.textTitleQuenCC.trim() === "") {
            Toast.show("Bạn cần nhập lý do bạn quên chấm công.")
        } else {
            this.data = this.props.listBlockCa.detail.forEach(element => {
                let indexCa = this.dataSeleLoaiCaNghi.id
                let timeCreated = this.toTime ? configs.convertTimeDate(this.toTime, configs.FORMAT_HH_MM_SS) : ''
                let accept_checkin = configs.quyDoiTimeStampToTime(element[0][indexCa - 1].accept_checkin, configs.FORMAT_HH_MM_SS)
                let accept_checkout = configs.quyDoiTimeStampToTime(element[0][indexCa - 1].accept_checkout, configs.FORMAT_HH_MM_SS)
                let deadline_start = element[0][indexCa - 1].deadline_start * 60
                let deadline_end = element[0][indexCa - 1].deadline_end * 60
                let dateStart = configs.quyDoiTimeStampToTime(element[0][indexCa - 1].time_end - deadline_start, configs.FORMAT_HH_MM_SS)
                let dateEnd = configs.quyDoiTimeStampToTime(element[0][indexCa - 1].time_end - deadline_end, configs.FORMAT_HH_MM_SS)
                if (this.dataLoaiQuenChamCong.id === 1) {
                    if (accept_checkin < timeCreated && timeCreated < dateStart) {
                        let params = {
                            type: this.dataLoaiQuenChamCong.value,
                            date: configs.convertTimeDate(this.dateQuenChamCong, configs.FORMAT_DATE),
                            time: timeCreated,
                            title: this.textTitleQuenCC,
                            content: this.textLyDoQuen,
                            typeOrder: "3"
                        }
                        this.props.createRequestOrder(params)
                    }
                    else {
                        Toast.show("Thời gian không phù hợp, xin vui lòng chọn lại", 3000)
                    }
                }
                else if (this.dataLoaiQuenChamCong.id === 2) {
                    if (dateEnd < timeCreated && timeCreated < accept_checkout) {
                        let params = {
                            type: this.dataLoaiQuenChamCong.value,
                            date: configs.convertTimeDate(this.dateQuenChamCong, configs.FORMAT_DATE),
                            time: timeCreated,
                            title: this.textTitleQuenCC,
                            content: this.textLyDoQuen,
                            typeOrder: "3"
                        }
                        this.props.createRequestOrder(params)
                    }
                    else {
                        Toast.show("Thời gian không phù hợp, xin vui lòng chọn lại", 3000)
                    }
                }
            });
        }
    }

    reRender = () => {
        this.setState(prevState => ({ reRender: prevState.reRender = !this.state.reRender }))
    }

    render() {
        let dateQuenChamCong = this.dateQuenChamCong && configs.convertTimeDate(this.dateQuenChamCong, configs.FORMAT_DATE_VN) || ""
        let dateShow = this.dateQuenChamCong
        return (
            <View style={{ flex: 1 }}>
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps='handled'
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 12, marginTop: 12, paddingBottom: 50 }}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={[styles.styleTitle, { color: 'black', fontWeight: 'bold', fontSize: 18 }]}>{'Thời gian'}</Text>

                    <InputView
                        id={"LoaiQuenChamCong"}
                        isCleared
                        editable={false}
                        style={[styles.styleInput]}
                        styleTextInputElement={[styles.styleTextInputElement]}
                        placeholder={"Chọn loại bạn quên chấm công..."}
                        value={this.dataLoaiQuenChamCong.title}
                        blurOnSubmit={true}
                        iconLeft={'user-profile-edit'}
                        textTitle={"Chọn loại quên chấm công: "}
                        onChangeText={this.setValueTextInput}
                        onPressText={() => {
                            let params = {
                                title: 'Chọn loại quên chấm công',
                                id: "LoaiQuenChamCong",
                                itemSelect: this.dataLoaiQuenChamCong ? this.dataLoaiQuenChamCong.id : null,
                                dataList: dataQuenChamCong,
                            }
                            this.showDialogChonItemFromList(1, true, params)
                        }}
                    />

                    <InputView
                        id={1}
                        onPressText={(id, value) => {
                            this.showPickerDate(1, true)
                        }}
                        multiline
                        editable={false}
                        style={[styles.styleInput, { marginTop: 8 }]}
                        styleTextInputElement={[styles.styleTextInputElement, {
                        }]}
                        styleInput={{
                        }}
                        placeholder={"Chọn ngày bạn quên chấm công..."}
                        value={dateQuenChamCong}
                        iconLeft={'calendar'}
                        textTitle={"Ngày bạn quên chấm công: "}
                        onChangeText={(id, value) => {
                            if (value === '') {
                                this.fromDate = ''
                                this.reRender()
                            }
                        }}
                    />
                    {this.showInputView ?
                        <InputView
                            id={5}
                            isCleared={false}
                            editable={false}
                            style={[styles.styleInput]}
                            styleTextInputElement={[styles.styleTextInputElement]}
                            placeholder={"Chọn ca bạn quên chấm công ..."}
                            value={this.dataSeleLoaiCaNghi.title}
                            blurOnSubmit={true}
                            iconLeft={'user-profile-edit'}
                            textTitle={"Ca bạn quên chấm công: "}
                            onChangeText={this.setValueTextInput}
                            onPressText={() => {
                                this.data = this.props.listBlockCa.detail.forEach(element => {
                                    this.blook = element[0]
                                });
                                let params = {
                                    title: 'Chọn ca nghỉ',
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
                                this.showDialogChonItemFromList(2, true, params)
                            }}
                        /> : null
                    }
                    {this.showInputView1 ?
                        <InputView
                            id={4}
                            isCleared
                            editable={false}
                            onPressText={(id, value) => {
                                this.showPickerDate(2, true)
                            }}
                            multiline
                            style={[styles.styleInput, { marginTop: 8 }]}
                            styleTextInputElement={[styles.styleTextInputElement, {
                            }]}
                            styleInput={{
                            }}
                            placeholder={"Chọn thời gian bạn chấm công vào/ra"}
                            value={this.toTime ? configs.convertTimeDate(this.toTime, configs.FORMAT_HH_MM) : ''}
                            iconLeft={'calendar'}
                            textTitle={"Chọn thời gian bạn chấm công vào/ra"}
                            onChangeText={(id, value) => {
                                if (value === '') {
                                    this.toTime = ''
                                    this.reRender()
                                }
                            }}
                        /> : null
                    }

                    <View style={{ height: 0.5, width: '100%', borderColor: configs.colorBorder, borderWidth: 0.5, marginVertical: 12 }} />
                    <Text style={[styles.styleTitle, { color: 'black', fontWeight: 'bold', fontSize: 18 }]}>{'Lý do'}</Text>
                    <Text style={[styles.styleTitle, { color: 'black', fontSize: 13 }]}>{'Nhập lý do bạn quên chấm công.'}</Text>

                    <InputView
                        id={2}
                        isCleared
                        style={[styles.styleInput]}
                        styleTextInputElement={[styles.styleTextInputElement, {
                        }]}
                        styleInput={{
                            height: '100%',
                        }}
                        placeholder={"Nhập tiêu đề lý do ..."}
                        value={this.textTitleQuenCC}
                        blurOnSubmit={true}
                        iconLeft={'parcel-edit'}
                        textTitle={"Tiêu đề lý do: "}
                        onChangeText={this.setValueTextInput}
                    />

                    <InputView
                        id={3}
                        isCleared
                        style={[styles.styleInput]}
                        styleTextInputElement={[styles.styleTextInputElement, {
                            height: 100
                        }]}
                        placeholder={"Nhập lý do bạn quên chấm công ..."}
                        value={this.textLyDoQuen}
                        blurOnSubmit={true}
                        iconLeft={'parcel-edit'}
                        textTitle={"Lý do bạn quên chấm công: "}
                        onChangeText={this.setValueTextInput}
                        multiline
                    />
                </KeyboardAwareScrollView>

                <View style={{ height: 65, justifyContent: 'center' }}>
                    <TouchableOpacity onPress={this.setGuiYeuCau} style={{
                        // <TouchableOpacity onPress={() => { this.findCoordinates() }} style={{
                        backgroundColor: configs.colorMain,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 8,
                        height: 48,
                        elevation: 3,
                        shadowOffset: {
                            width: 0,
                            height: 2
                        },
                        shadowOpacity: 0.6,
                        shadowColor: '#000',
                        shadowRadius: 8,
                        marginHorizontal: 12
                    }}>
                        <Text style={[styles.styleTitle, { color: 'white', fontWeight: 'bold', fontSize: 18 }]}>{'Gửi yêu cầu'}</Text>
                    </TouchableOpacity>
                </View>

                <DateTimePickerModal
                    isVisible={this.state.isShowPickerDate}
                    mode={this.indexPickerDate === 2 ? 'time' : 'date'}
                    locale={'vi'}
                    date={new Date()}
                    confirmTextIOS='Thay Đổi'
                    cancelTextIOS='Hủy'
                    titleIOS={this.indexPickerDate === 1 ? "Chọn ngày" : "Chọn giờ"}
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
    styleInput: {
        marginTop: configs.margin10,
    },
    styleViewIconLeftBase: {
        padding: configs.padding,
        width: configs.heightToolBar,
        justifyContent: 'center',
        alignItems: 'flex-start',
        left: configs.marginLeft10,
    },
    viewRow: {
        backgroundColor: 'white',
        height: 35,
        paddingHorizontal: configs.padding15,
        borderBottomColor: configs.colorBorder,
        borderBottomWidth: 1
    },
    viewContentRow: {
        flexDirection: 'row',
        flex: 1,
        height: '100%',
        alignItems: 'center',
        marginLeft: 5,

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

const mapStateToProps = ({ OrderReducer: { listBlockCa } }, state) => ({
    listBlockCa,
    ChartStatisticalReducer: state.ChartStatisticalReducer
});

const mapDispatchToProps = (dispatch) => {
    return {
        getlatesoonApi: () => {
            api.getLateSoonAdmin(dispatch)
        },
        showLoadding: () => {
            dispatch(actions.showLoading())
        },
        getListBlookCa: (params) => {
            api.getListBlookCa(dispatch, params)
        },
        hideLoadding: () => {
            dispatch(actions.hideLoading())
        },
        createRequestOrder: (params) => {
            api.createRequestOrder(dispatch, params)
        }
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(QuenChamCongScreen)