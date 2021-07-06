import React from 'react';
import {
    StyleSheet,
    Image,
    Animated,
    TouchableOpacity,
    View,
    Text,
} from 'react-native';
import { BaseComponent, BaseView, IconView, TextView } from '../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../commons';
import DialogFilterDate from '../../components/DialogFilterDate';
import { api } from '../../../commons/api/Api';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { models } from '../../../commons/model';
import DialogDetailDate from './component/DialogDetailDate';

const icon_user = require('../../../assets/image/hinhbia.jpg');
class XinNghiPhepScreen extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            isArrowShow: false,
            isShowPickerDate: false,
            reRender: false,
            showDialogDate: false,
            isShowDialog: false,
            dataBlook: [],
        }
        this.fromDate = ''
        this.toDate = ''
        this.dataLogin = models.getDataLogin()
        this.getDetailTime_sheet = this.getDetailTime_sheet.bind(this)
        this.getListBlookCa = this.getListBlookCa.bind(this)
        this.showDialog = this.showDialog.bind(this);

    }

    getDateMonth(year, month) {
        let paramsHistory = {}
        paramsHistory = {
            date_start: configs.convertTimeDate(new Date(year, month, 1, 0, 0), configs.FORMAT_DATE),
            date_end: configs.convertTimeDate(new Date(year, month + 1, 0, 0, 0), configs.FORMAT_DATE)
        }
        return paramsHistory
    }

    getListBlookCa = (params) => {
        this.props.getListBlookCa(params);
    }

    showDialog = (isShow) => {
        this.setState({ isShowDialog: isShow });
    };

    componentDidMount() {
        let now = new Date()
        let params = this.getDateMonth(now.getFullYear(), now.getMonth())
        this.fromDate = params.date_start
        this.toDate = params.date_end
        this.getDetailTime_sheet(params)
        this.getListBlookCa(params)
    }

    getDetailTime_sheet = (params) => {
        this.props.getDetailTime_sheet(params);
    }

    reRender = () => {
        this.setState(prevState => ({ reRender: prevState.reRender = !this.state.reRender }))
    }

    onDayPress(day) {
        let data = this.props.listBlockCa.listBlockCa.detail?.find((item) => item.date === day);
        this.setState({
            dataBlook: {
                data: data && data[0] || [],
                date: data?.date
            },
            isShowDialog: true
        })

    }

    showFilterDate = (id, showSearch) => {
        this.setState(prevState => ({ showDialogDate: prevState.showDialogDate = showSearch }))
    }

    applyFilterDate = (toDate, fromDate) => {
        this.fromDate = configs.convertTimeDate(fromDate, configs.FORMAT_DATE)
        this.toDate = configs.convertTimeDate(toDate, configs.FORMAT_DATE)
        let params = {
            date_start: this.fromDate,
            date_end: this.toDate
        }
        this.getDetailTime_sheet(params)
    }

    setTimeHistory(data, dataHistory, dataTimeSetUp) {
        let timeEnd = new Date(configs.convertTimeDate1(dataTimeSetUp.time_start))
        data.map((item) => {
            let timeStart = new Date(configs.convertTimeDate1(item.time_start))
            if (item.time_start) {
                item.tongGioLam = configs.convertTruGio(item.time_end, item.time_start)
            } else {
                item.tongGioLam = configs.timeHide
            }
        })
        this.dataHistory = data
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.detaiTimeSheet) {
            if (this.props.detaiTimeSheet && this.props.detaiTimeSheet !== prevProps.detaiTimeSheet) {
                let data = this.props.detaiTimeSheet
                data = data && data.data ? Object.values(data.data) : []
                let dataHistory = this.props.detaiTimeSheet?.data || []

                let filterHoliday = data.filter(obj => obj.remain == 0 && obj.shift == 0)
                this.setTimeHistory(data, dataHistory, filterHoliday)
            }
        }
    }

    renderContentItem = (item, index) => {
        // console.log({item})
        if (item) {
            let backgroundColor =
                item.late === 0 ? configs.colorMainDaiMau2 : '#ff9933';
            let textColor = 'white';
            let borderColor = item.late === 0 ? configs.colorMain : '#ff9933';
            return (
                <View
                    style={[
                        styles.cardItem,
                        { borderColor: borderColor, borderWidth: 0.5 },
                    ]}>
                    <View
                        style={{
                            flexDirection: 'row',
                            backgroundColor: backgroundColor,
                            minHeight: configs.height30,
                            borderBottomColor: backgroundColor,
                            borderBottomWidth: 1,
                            justifyContent: 'center',
                            alignContent: 'center',
                            alignItems: 'center',
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                        }}>
                        <View style={[styles.styleStatusName, { flexDirection: 'row' }]}>
                            <Text style={[{ color: 'white', fontWeight: '500' }]}>
                                {item.date}
                            </Text>
                        </View>
                        <View style={[styles.styleStatusTime, {}]}>
                            <Text
                                style={{
                                    fontSize: configs.fontSize14,
                                    color: 'black',
                                    paddingHorizontal: 8,
                                }}>
                                {item.remain > 0
                                    ? 'Không đủ công'
                                    : item.late === 0
                                        ? 'Đi đúng giờ'
                                        : 'Đi muộn'}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <View
                            style={{
                                marginLeft: 12,
                            }}>
                            {item.image_in ? (
                                <Image
                                    source={{ uri: item.image_in }}
                                    style={[
                                        {
                                            width: 40,
                                            height: 40,
                                            borderRadius: 40 / 2,
                                        },
                                    ]}
                                />
                            ) : (
                                <View />
                            )}
                            {item.image_out ? (
                                <Image
                                    source={{ uri: item.image_out }}
                                    style={[
                                        {
                                            width: 40,
                                            height: 40,
                                            borderRadius: 40 / 2,
                                            marginTop: 12,
                                        },
                                    ]}
                                />
                            ) : (
                                <View />
                            )}
                        </View>
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={() => this.onDayPress(item.date)}
                        >
                            <View style={{ flex: 1 }}>
                                <TextView
                                    style={[styles.stylesRow]}
                                    stylesTextContent={styles.stylesTextContent}
                                    styleTitle={styles.styleLabel}
                                    styleValue={styles.styleValue}
                                    title={'Số công: '}
                                    value={item.shift ? item.shift : 0}
                                />
                                <TextView
                                    style={[styles.stylesRow, {}]}
                                    stylesTextContent={styles.stylesTextContent}
                                    styleTitle={styles.styleLabel}
                                    styleValue={styles.styleValue}
                                    title={'Tổng giờ làm: '}
                                    value={item.time_real ? item.time_real : 0}
                                />
                                <TextView
                                    style={styles.stylesRow}
                                    stylesTextContent={styles.stylesTextContent}
                                    styleTitle={styles.styleLabel}
                                    styleValue={styles.styleValue}
                                    title={'Giờ Tiêu chuẩn: '}
                                    value={item.time_official ? item.time_official : 0}
                                />
                                <TextView
                                    style={[styles.stylesRow]}
                                    stylesTextContent={styles.stylesTextContent}
                                    styleTitle={styles.styleLabel}
                                    styleValue={styles.styleValue}
                                    title={'T/G đi muộn/về sớm: '}
                                    value={item.late + item.soon ? item.late + item.soon : 0}
                                />
                                <TextView
                                    style={[styles.stylesRow, {}]}
                                    stylesTextContent={styles.stylesTextContent}
                                    styleTitle={styles.styleLabel}
                                    styleValue={styles.styleValue}
                                    title={'Chi tiết ca làm việc trong ngày '}
                                    value={item.device_start ? item.device_start : ''}
                                />
                            </View>
                        </TouchableOpacity>

                    </View>
                </View>
            );
        }
        return null;
    };

    renderInnerCircleCurrent() {
        let dotSize = 12;
        let color = configs.colorMain;
        let styleOutline = {
            height: 12,
            width: 12,
            padding: 1,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: color,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignContent: 'center',
        };
        let dotStyle = {
            height: 8,
            width: 8,
            borderRadius: 4,
            backgroundColor: color,
            justifyContent: 'center',
            alignContent: 'center',
        };
        return (
            <View style={[styleOutline]}>
                <View style={[dotStyle]} />
            </View>
        );
    }

    renderInnerCircle() {
        let dotColor = 'red';
        let styleOutline = {
            height: 12,
            width: 12,
            padding: 1,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: dotColor,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignContent: 'center',
        };
        let dotStyle = {
            height: 8,
            width: 8,
            borderRadius: 4,
            backgroundColor: dotColor,
            justifyContent: 'center',
            alignContent: 'center',
        };
        return (
            <View style={[styleOutline]}>
                <View style={[dotStyle]} />
            </View>
        );
    }

    renderLineCircle = (item, index) => {
        let renderTopLine;
        let renderBottomLine;
        if (index === 0) {
            renderTopLine = (
                <View style={{ width: 0, height: 25, backgroundColor: 'transparent' }} />
            );
        } else {
            renderTopLine = (
                <View style={{ width: 1, height: 25, backgroundColor: '#DCDCDC' }} />
            );
        }
        if (index === this.conventdatasheet.length - 1) {
            renderBottomLine = (
                <View style={{ width: 0, flex: 1, backgroundColor: 'transparent' }} />
            );
        } else {
            renderBottomLine = (
                <View style={{ width: 1, flex: 1, backgroundColor: '#DCDCDC' }} />
            );
        }
        let innerCircle = item.isOnTime
            ? this.renderInnerCircleCurrent()
            : this.renderInnerCircle();
        return (
            <View style={{ alignItems: 'center' }}>
                {renderTopLine}
                {innerCircle}
                {renderBottomLine}
            </View>
        );
    };

    renderCell = (item, index) => {
        let color = item.isOnTime ? configs.colorMain : 'red';
        return (
            <View style={{ flexDirection: 'row' }}>
                {this.renderLineCircle(item, index)}
                <Text
                    style={{
                        marginTop: 20,
                        color: color,
                        alignContent: 'center',
                        justifyContent: 'center',
                    }}>
                </Text>
                {this.renderContentItem(item, index)}
            </View>
        );
    };

    render() {
        // this.conventdata = Object.values(this.props.detaiTimeSheet);
        // console.log("---------||", this.props.detaiTimeSheet.detaiTimeSheet);
        this.conventdatasheet = Object.values(this.props.detaiTimeSheet.detaiTimeSheet);
        this.conventdatasheet.pop();
        return (
            <BaseView
                stylesView={{ flex: 1, backgroundColor: 'white' }}
                titleScreen={'Lọc báo cáo'}
                isShowSubTitle={true}
                subTitle={this.fromDate + ' -> ' + this.toDate}
                isBorderBottomWidth={false}
                styleToolbar={{ height: 45 }}
                styleTitle={[styles.styleTitle]}
                styleTitleToolbarBase={styles.styleTitleToolbarBase}
                drawIconLeft={
                    <TouchableOpacity
                        style={[styles.styleViewIconLeftBase]}
                        onPress={this.props.handleMenu}>
                        <IconView
                            style={{ justifyContent: 'center', alignItems: 'center' }}
                            color="black"
                            name={'left-arrow'}
                            size={configs.sizeIcon20}
                            height={configs.sizeIcon20}
                        />
                    </TouchableOpacity>
                }
                isShowIconRight={true}
                nameIconRight={'filter'}
                colorIconRight={'black'}
                fontSizeIconRight={configs.fontSize24}
                onClickIconRight={() => {
                    this.showFilterDate(1, true);
                }}>
                <KeyboardAwareScrollView
                    style={{
                        marginHorizontal: 12,
                        flex: 1,
                        marginBottom: 12,
                        paddingBottom: 12,
                    }}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}>
                    {this.conventdatasheet.map((item, index) => this.renderCell(item, index))}
                </KeyboardAwareScrollView>

                <DialogFilterDate
                    isShowDialog={this.state.showDialogDate}
                    closedDialog={this.showFilterDate}
                    applyResponses={this.applyFilterDate}
                />

                <DialogDetailDate
                    isShowDialog={this.state.isShowDialog}
                    showDialog={this.showDialog}
                    {...this.state.dataBlook}
                />
            </BaseView>
        );
    }
}
export const scrollX = new Animated.Value(0);

const styles = StyleSheet.create({
    styleTitle: {
        fontSize: configs.fontSize14_5,
        fontFamily: 'Lato-Regular',
        color: 'black',
        flex: 1,
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
    cardItem: {
        flex: 1,
        flexDirection: 'column',
        marginTop: configs.marginTop15,
        backgroundColor: 'white',
        borderRadius: 8,
        shadowRadius: 4,
        shadowColor: 'gray',
        elevation: 3,
        shadowOpacity: 0.5,
        shadowOffset: {
            height: 1,
            width: 0,
        },
    },
    styleStatusName: {
        flex: 1,
        paddingLeft: configs.paddingLeft10,
        paddingRight: configs.paddingRight,
        fontSize: configs.fontSize14_5,
        paddingHorizontal: 8,
        borderRadius: 8,
        alignItems: 'center',
    },

    styleStatusTime: {
        minHeight: configs.height30,
        backgroundColor: 'white',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 8,
        justifyContent: 'center',
    },
    stylesRow: {
        borderBottomColor: configs.colorBorder,
        borderBottomWidth: 0.5,
        marginHorizontal: 12,
        paddingVertical: 8,
    },
    stylesRow1: {
        borderBottomColor: configs.colorBorder,
        borderBottomWidth: 0.5,
        marginHorizontal: 12,
        paddingVertical: 8,
    },
    stylesTextContent: {
        flex: 1,
        flexDirection: 'row',
    },

    styleLabel: {
        flex: 1,
        fontStyle: 'normal',
        fontSize: configs.fontSize13,
        color: configs.colorText1,
    },

    styleValue: {
        justifyContent: 'flex-end',
        alignContent: 'flex-end',
        textAlign: 'right',
        fontSize: configs.fontSize13,
        color: 'black',
    },
});

const mapStateToProps = (state) => ({
    detaiTimeSheet: state.LocBaoCaoReducer,
    listBlockCa: state.LocBaoCaoReducer,
});

const mapDispatchToProps = (dispatch) => {
    return {
        showLoadding: () => {
            dispatch(actions.showLoading())
        },
        getDetailTime_sheet: (params) => {
            api.getDetailTime_sheet(dispatch, params)
        },
        getListBlookCa: (params) => {
            api.getListBlookCa(dispatch, params)
        },
        hideLoadding: () => {
            dispatch(actions.hideLoading())
        },
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(XinNghiPhepScreen)
