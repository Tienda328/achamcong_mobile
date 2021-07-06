import React from 'react';
import { StyleSheet, Alert, Animated, TouchableOpacity, View, Text, FlatList, BackHandler } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView, InputView, RadioForm, DialogSelectItemFromList } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'
import { actions } from '../../../../commons/action';
import { api } from '../../../../commons/api/Api';
import ItemTimekeepingDay from './ItemTimekeepingDay'
import RBSheet from "react-native-raw-bottom-sheet";
import DateTimePickerModal from "react-native-modal-datetime-picker";

class TimekeepingDayScreen extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            reRender: false,
            dataList: [],
            isShowDialog: false,
            isShowPickerDate: false
        }
        this.dataTimekeeping = []
        this.pageIndex = 0
        this.pageSize = 30
        this.page = 0
        this.dataChiNhanhSelect = []
        this.date = ''

        this.renderItem = this.renderItem.bind(this)
        this.setValueTextInput = this.setValueTextInput.bind(this)
        this.showPickerDate = this.showPickerDate.bind(this)
        this.showDialogChonItemFromList = this.showDialogChonItemFromList.bind(this)
        this.handleSelectedPickerDate = this.handleSelectedPickerDate.bind(this)
        this.backPressed = this.backPressed.bind(this)
        this.navigatorMapCheckin = this.navigatorMapCheckin.bind(this)
    }

    getData() {
        if (this.dataTimekeeping.data.detail) {
            var dataList = this.dataTimekeeping.data.detail.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize)
            this.page = Math.ceil(this.dataTimekeeping.data.detail.length / this.pageSize)
            this.setState({
                dataList: dataList
            }, () => {
                this.props.hideLoadding()
            })
        } else {
            configs.showAlert(JSON.stringify(this.dataTimekeeping))
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    }

    backPressed = () => {
        this.props.navigation.goBack();
        return true;
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backPressed);
        this.dataChiNhanh = []

        try {
            let data = this.props.navigation.state.params.dataChiNhanh
            data.map((item) => {
                this.dataChiNhanh.push({
                    id: item.id,
                    title: item.name,
                    value: item.address
                })
            })
            this.dataChiNhanhSelect = this.dataChiNhanh[0]
            this.date = new Date()
            this.searchListChamCong()
        } catch (error) {
            
        }
        
    }

    searchListChamCong = () => {
        if (this.date === '') {
            configs.showAlert("Bạn cần chọn ngày.")
        } else if (!this.dataChiNhanhSelect.id) {
            configs.showAlert("Bạn cần chọn chi nhánh")
        } else {
            this.props.getTimeSheetDaily({
                "date": this.date && configs.convertTimeDate(this.date, configs.FORMAT_DATE) || "",
                "branch_search": [
                    {
                        "id": this.dataChiNhanhSelect.id,
                    }]
            })
        }
    }

    reRender = () => {
        this.setState(prevState => ({ reRender: prevState.reRender = !this.state.reRender }))
    }

    nextPageList = (isNext) => {
        this.props.showLoadding()
        setTimeout(() => {
            if (isNext) {
                this.pageIndex++
            } else {
                this.pageIndex--
            }
            this.getData()
        }, 700);
    }

    setValueTextInput = (id, data) => {
        if (id === 'ChiNhanh') {
            this.dataChiNhanhSelect = data
        }

        this.reRender()
    }

    showDialogChonItemFromList(isShow, dataDialog) {
        if (isShow) {
            this.dataDialogChonItemFromList = dataDialog
        }
        this.setState({
            isShowDialog: isShow,
        })
    }

    showPickerDate = (isShow = true) => {
        this.setState(state => ({ isShowPickerDate: state.isShowPickerDate = isShow }))
    }

    handleSelectedPickerDate = (date) => {
        this.date = date
        this.showPickerDate(false)
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.ChartStatisticalReducer) {
            if (this.props.ChartStatisticalReducer.dataTimekeepingDay && this.props.ChartStatisticalReducer.dataTimekeepingDay !== prevProps.ChartStatisticalReducer.dataTimekeepingDay) {
                let dataTimekeepingDay = this.props.ChartStatisticalReducer.dataTimekeepingDay
                this.dataTimekeeping = dataTimekeepingDay
                this.getData()
            }
        }
    }

    navigatorMapCheckin = (item) => {
        this.props.navigation.navigate("ListMapCheckin", {dataItem: item})
    }

    renderItem = ({ item, index }) => {
        return (
            <ItemTimekeepingDay
                dataItem={item}
                index={(index + this.pageIndex * this.pageSize)}
                // navigation={this.props.navigation}
                navigatorMapCheckin={this.navigatorMapCheckin}
            />
        )
    }

    render() {
        let date = this.date && configs.convertTimeDate(this.date, configs.FORMAT_DATE) || ""
        return (
            <BaseView stylesView={{ flex: 1, backgroundColor: 'white' }}
                titleScreen={'Danh sách chấm công'}
                subTitle={'havantam.it@gmail.com'}
                isBorderBottomWidth={false}
                styleToolbar={{ height: 45 }}
                styleTitle={[styles.styleTitle, { flex: 1 }]}
                styleTitleToolbarBase={styles.styleTitleToolbarBase}
                drawIconLeft={
                    <TouchableOpacity style={[styles.styleViewIconLeftBase]}
                        onPress={this.backPressed}>
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

                <View style={{
                    height: 75, backgroundColor: '#e6e6e6', flexDirection: 'row',
                    borderTopWidth: 0.5,
                    borderTopColor: 'gray'
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        position: 'absolute',
                        top: 0,
                        width: '100%',
                        height: 75,
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                    }} />

                    <InputView
                        id={1}
                        editable={false}
                        isCleared={false}
                        style={[styles.styleInput, { flex: 2 }]}
                        styleTextInputElement={[styles.styleTextInputElement]}
                        placeholder={"Chọn ngày ..."}
                        value={date}
                        blurOnSubmit={true}
                        // iconLeft={'password-login'}
                        textTitle={"Chọn ngày: "}
                        // onChangeText={this.showPickerDate}
                        onPressText={this.showPickerDate}
                    />

                    <InputView
                        id={2}
                        editable={false}
                        isCleared={false}
                        style={[styles.styleInput, { flex: 3 }]}
                        styleTextInputElement={[styles.styleTextInputElement]}
                        placeholder={"Chọn chi nhánh ..."}
                        value={this.dataChiNhanhSelect.title}
                        blurOnSubmit={true}
                        // iconLeft={'password-login'}
                        textTitle={"Chọn chi nhánh: "}
                        onPressText={() => {
                            let params = {
                                title: 'Chọn loại chi nhánh',
                                id: "ChiNhanh",
                                itemSelect: this.dataChiNhanhSelect ? this.dataChiNhanhSelect.id : null,
                                dataList: this.dataChiNhanh,
                            }
                            this.showDialogChonItemFromList(true, params)
                        }}
                    />

                    <IconView
                        name={'search'}
                        size={20}
                        color={configs.colorMain}
                        style={{
                            padding: 12,
                            borderRadius: 8, backgroundColor: '#e6e6e6',
                            width: 44,
                            height: 44,
                            marginTop: 20,
                            marginRight: 12
                        }}
                        onPress={this.searchListChamCong}
                    />
                </View>

                <FlatList
                    style={{ flex: 1, backgroundColor: '#e6e6e6' }}
                    data={this.state.dataList}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id}
                />

                <View style={{
                    flexDirection: 'row',
                    backgroundColor: '#f2f2f2',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 40,
                    borderWidth: 1,
                    borderColor: 'gray'
                }}>
                    <IconView
                        name={'left-arrow'}
                        size={20}
                        color={this.pageIndex !== 0 ? 'black' : 'gray'}
                        style={{ paddingHorizontal: 12 }}
                        onPress={() => {
                            if (this.pageIndex !== 0) {
                                this.nextPageList(false)
                            }
                        }}
                    />
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>{(this.pageIndex + 1) + '/' + this.page} </Text>
                    <IconView
                        name={'right-arrow'}
                        size={20}
                        color={(this.pageIndex + 1) !== this.page ? 'black' : 'gray'}
                        style={{ paddingHorizontal: 12 }}
                        onPress={() => {
                            if ((this.pageIndex + 1) !== this.page) {
                                this.nextPageList(true)
                            }
                        }}
                    />
                </View>

                <DateTimePickerModal
                    isVisible={this.state.isShowPickerDate}
                    mode={this.indexPickerDate === 2 ? 'time' : 'date'}
                    locale={'vi'}
                    date={this.date ? new Date(this.date) : new Date()}
                    confirmTextIOS='Thay Đổi'
                    cancelTextIOS='Hủy'
                    titleIOS={this.indexPickerDate === 1 ? "Chọn ngày" : "Chọn giờ"}
                    onConfirm={this.handleSelectedPickerDate}
                    onCancel={() => this.showPickerDate(false)}
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
    tabBarStyle: {
        backgroundColor: "#ffffff",
        borderTopColor: configs.colorDivide,
        width: '100%',
        borderTopWidth: 0,
        paddingLeft: 5,
        marginTop: 0,
    },
    styleInput: {
        marginTop: 8,
        marginHorizontal: 8
    },
    styleTextInputElement: {
        flexDirection: 'row',
        height: configs.heightInput40,
        borderColor: configs.colorTitleCard,
        borderRadius: 8

    },
})

const mapStateToProps = state => ({
    ChartStatisticalReducer: state.ChartStatisticalReducer
});

const mapDispatchToProps = (dispatch) => {
    return {
        showLoadding: () => {
            dispatch(actions.showLoading())
        },
        hideLoadding: () => {
            dispatch(actions.hideLoading())
        },
        getTimeSheetDaily: (params) => {
            api.getTimeSheetDaily(dispatch, params)
        }
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(TimekeepingDayScreen)