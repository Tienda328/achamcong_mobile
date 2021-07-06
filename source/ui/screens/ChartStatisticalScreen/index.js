import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Animated, Dimensions, Text, BackHandler } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView, TextView, DialogSelectItemFromList } from '../../components';
import BaseViewAdmin from '../HomeAdminScreen/component/BaseViewAdmin'
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../commons'
import { BarChart, PieChart, LineChart } from 'react-native-chart-kit'
import LinearGradient from 'react-native-linear-gradient';
import { models } from '../../../commons/model';
import { ScrollView } from 'react-native-gesture-handler';
import { api } from '../../../commons/api/Api';
import RBSheet from "react-native-raw-bottom-sheet";
import ContentBottomSheet from './Component/ContentBottomSheet'
import ContentPBanCNhanh from './Component/ContentPBanCNhanh'
const screenWidth = Dimensions.get("window").width;
const icon_menu = require('../../../assets/image/icon_menu.png')

const dataLOAIBIEUDO = [
    {
        id: 1,
        title: 'Đi muộn',
        value: 0
    },
    {
        id: 2,
        title: 'Về sớm',
        value: 1
    },
    {
        id: 3,
        title: 'Tổng công làm',
        value: 2
    },
]

class ChartStatisticalScreen extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            reRender: false,
            isShowDialog: false,
            isArrowShowCard: true,
            isArrowShowCard7ngay: true,
            textTitleBieuDo: 'Đi muộn'
        }

        this.backPressed = this.backPressed.bind(this)
        this.dataChartDiMuon = []
        this.showDialogChonItemFromList = this.showDialogChonItemFromList.bind(this)
        this.setValueTextInput = this.setValueTextInput.bind(this)
        this.handleOnClickView = this.handleOnClickView.bind(this)
        this.renderBottom = this.renderBottom.bind(this)
        this.navigateTimeKeepingDay = this.navigateTimeKeepingDay.bind(this)
        this.closeSheet = this.closeSheet.bind(this)
        this.dataSelectLoaiBieuDo = dataLOAIBIEUDO[0]
        this.dataChart = []
        this.dataChiNhanh = []
        this.dataPhongBan = []
        this.dataNhanVien = []
        this.idBottom = '0'

        this.sheetRef = React.createRef();
    }

    getData() {
        this.dataChartDiMuon = []
        let dataDate = configs.getDateTimeLast7Day()
        let dataColor = configs.getColorChart()

        try {
            for (let index = 0; index < dataDate.length; index++) {
                this.dataChartDiMuon.push({
                    name: dataDate[index].replace("\'", "").replace("\'", ""),
                    population: this.dataChart[index][this.dataSelectLoaiBieuDo.value],
                    color: dataColor[index],
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 15
                })

            }
        } catch (error) {
            console.log("error:   " + error)
        }
        this.reRender()
    }

    reRender = () => {
        this.setState(prevState => ({ reRender: prevState.reRender = !this.state.reRender }))
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
        if (id === 'LoaiBieuDo') {
            this.dataSelectLoaiBieuDo = data
            this.getData()
            this.setState({
                textTitleBieuDo: data.title
            })
        }

        this.reRender()
    }

    handleOnClickView = (value, id) => {
        this.idBottom = id
        console.log("this.idBottom:    ", this.idBottom)
        this.reRender()
        this.RBSheet.open()
    }
    closeSheet = () => {
        this.RBSheet.close()
    }

    componentDidMount() {
        this.props.requestDataChartStatisAdmin()
        BackHandler.addEventListener('hardwareBackPress', this.backPressed);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    }

    backPressed = () => {
        this.props.navigation.goBack();
        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.ChartStatisticalReducer) {
            if (this.props.ChartStatisticalReducer.dataLateSoon && this.props.ChartStatisticalReducer.dataLateSoon !== prevProps.ChartStatisticalReducer.dataLateSoon) {
                let lateSoon = this.props.ChartStatisticalReducer.dataLateSoon
                // this.dataChart = lateSoon.dataLateSoonAdmin
                this.dataChiNhanh = lateSoon.dataChiNhanh
                this.dataPhongBan = lateSoon.dataPhongBan
                this.dataNhanVien = lateSoon.dataNhanVien
                this.getData()
            }
        }
    }

    navigateTimeKeepingDay = () => {
        this.props.navigation.navigate('TimekeepingDayScreen', { dataChiNhanh: this.dataChiNhanh })
    }

    renderBottom = () => {
        if (this.idBottom === 3) {
            return (
                <ContentBottomSheet
                    closeSheet={this.closeSheet}
                    dataPhongBan={this.dataPhongBan}
                    dataChiNhanh={this.dataChiNhanh}
                    dataNhanVien={this.dataNhanVien}
                />
            )
        } else if (this.idBottom === 2 || this.idBottom === 1) {
            return (
                <ContentPBanCNhanh
                    closeSheet={this.closeSheet}
                    dataPhongBan={this.dataPhongBan}
                    dataChiNhanh={this.dataChiNhanh}
                    id={this.idBottom}
                />
            )
        }

    }

    render() {
        let { isArrowShowCard, textTitleBieuDo, isArrowShowCard7ngay } = this.state
        return (
            <BaseViewAdmin stylesView={{ flex: 1, backgroundColor: 'white' }}
                titleScreen={"thống kê công ty"}
                subTitle={'havantam.it@gmail.com'}
                styleToolbar={{ height: 45 }}
                isBorderBottomWidth={false}
                styleTitle={[styles.styleTitle]}
                styleTitleToolbarBase={[styles.styleTitleToolbarBase, { color: 'white' }]}
                drawIconLeft={
                    <TouchableOpacity style={[styles.styleViewIconLeftBase]}
                        onPress={this.props.handleMenu}>
                        <Image
                            source={icon_menu}
                            style={{ justifyContent: 'center', alignItems: 'center', width: 20, height: 20, tintColor: 'black' }}
                        />

                        {/* <IconView
                            style={{ justifyContent: 'center', alignItems: 'center', }}
                            color='black'
                            name={"left-arrow"}
                            size={configs.sizeIcon20}
                            height={configs.sizeIcon20}
                        /> */}
                    </TouchableOpacity>
                }
            >

                <ScrollView>
                    <CardView
                        styleCard={{ margin: 8, borderWidth: 0.5, borderColor: '#737373', }}
                        styleTitleCard={{
                            fontWeight: 'bold', fontSize: 16,
                        }}
                        styleHeader={{
                            borderBottomLeftRadius: 8,
                            borderBottomRightRadius: 8
                        }}
                        titleCard={"Thông tin công ty"}
                        nameIcon={isArrowShowCard ? 'arrow-down' : 'arrow-up'}
                        stylesBgIcon={{}}
                        sizeIcon={configs.sizeIcon24}
                        onPressIcon={() => { this.setState({ isArrowShowCard: !isArrowShowCard }) }}>
                        {isArrowShowCard ? <View>
                            <TextView
                                id={1}
                                onPress={this.handleOnClickView}
                                style={styles.viewRow}
                                stylesTextContent={styles.viewContentRow}
                                styleValue={{ fontFamily: 'Lato-Regular', fontSize: 14, color: "#323B45" }}
                                styleTitle={[{ flex: 1, fontStyle: 'normal', fontSize: 12, color: configs.colorText }]}
                                title={'Số chi nhánh'}
                                value={this.dataChiNhanh.length + ' chi nhánh'}
                                iconLeft='customer-check'
                                iconColor={configs.colorText}
                                iconSize={configs.sizeIcon14}
                            />

                            <TextView
                                id={2}
                                onPress={this.handleOnClickView}
                                style={styles.viewRow}
                                stylesTextContent={styles.viewContentRow}
                                styleValue={{ fontFamily: 'Lato-Regular', fontSize: 14, color: "#323B45" }}
                                styleTitle={[{ flex: 1, fontStyle: 'normal', fontSize: 12, color: configs.colorText }]}
                                title={'Số phòng ban'}
                                value={this.dataPhongBan.length + ' phòng ban'}
                                iconLeft='parcel-code'
                                iconColor={configs.colorText}
                                iconSize={configs.sizeIcon14}
                            />

                            <TextView
                                id={3}
                                onPress={this.handleOnClickView}
                                style={[styles.viewRow, {
                                    borderBottomLeftRadius: 8,
                                    borderBottomRightRadius: 8
                                }]}
                                stylesTextContent={styles.viewContentRow}
                                styleValue={{ fontFamily: 'Lato-Regular', fontSize: 14, color: "#323B45" }}
                                styleTitle={[{ flex: 1, fontStyle: 'normal', fontSize: 12, color: configs.colorText }]}
                                title={'Số nhân viên'}
                                value={this.dataNhanVien.length + ' nhân viên'}
                                iconLeft='customer-info'
                                iconColor={configs.colorText}
                                iconSize={configs.sizeIcon14}
                            />
                        </View> : <View />}
                    </CardView>

                    <CardView
                        styleCard={{ margin: 8, borderWidth: 0.5, borderColor: '#737373', }}
                        styleTitleCard={{
                            fontWeight: 'bold', fontSize: 16,
                        }}
                        styleHeader={{
                            borderBottomLeftRadius: 8,
                            borderBottomRightRadius: 8
                        }}
                        titleCard={"Thông tin thống kê trong 7 ngày"}
                        nameIcon={isArrowShowCard7ngay ? 'arrow-down' : 'arrow-up'}
                        stylesBgIcon={{}}
                        sizeIcon={configs.sizeIcon24}
                        onPressIcon={() => { this.setState({ isArrowShowCard7ngay: !isArrowShowCard7ngay }) }}>
                        {isArrowShowCard7ngay ? <View>
                            <TextView
                                style={styles.viewRow}
                                stylesTextContent={styles.viewContentRow}
                                styleValue={{ fontFamily: 'Lato-Regular', fontSize: 14, color: "#323B45" }}
                                styleTitle={[{ flex: 1, fontStyle: 'normal', fontSize: 12, color: configs.colorText }]}
                                title={'Tổng công trong 7 ngày'}
                                value={this.dataChart && this.dataChart[8] ? this.dataChart[8] : "0"}
                                iconLeft='customer-check'
                                iconColor={configs.colorText}
                                iconSize={configs.sizeIcon14}
                            />

                            <TextView
                                style={styles.viewRow}
                                stylesTextContent={styles.viewContentRow}
                                styleValue={{ fontFamily: 'Lato-Regular', fontSize: 14, color: "#323B45" }}
                                styleTitle={[{ flex: 1, fontStyle: 'normal', fontSize: 12, color: configs.colorText }]}
                                title={'tổng công max'}
                                value={this.dataChart && this.dataChart[9] ? this.dataChart[9] : "0"}
                                iconLeft='parcel-code'
                                iconColor={configs.colorText}
                                iconSize={configs.sizeIcon14}
                            />

                            <TextView
                                style={[styles.viewRow, {
                                    borderBottomLeftRadius: 8,
                                    borderBottomRightRadius: 8
                                }]}
                                stylesTextContent={styles.viewContentRow}
                                styleValue={{ fontFamily: 'Lato-Regular', fontSize: 14, color: "#323B45" }}
                                styleTitle={[{ flex: 1, fontStyle: 'normal', fontSize: 12, color: configs.colorText }]}
                                title={'Số phép nghỉ trong 7 ngày'}
                                value={this.dataChart && this.dataChart[10] ? this.dataChart[10] : "0"}
                                iconLeft='customer-info'
                                iconColor={configs.colorText}
                                iconSize={configs.sizeIcon14}
                            />

                            <TouchableOpacity onPress={this.navigateTimeKeepingDay}>
                                <Text style={[styles.styleTitle, { padding: 12, fontSize: 12, color: configs.colorOrange, textAlign: 'right', }]}>{'Chi tiết chấm công 1 ngày >>>'}</Text>
                            </TouchableOpacity>
                        </View> : <View />}
                    </CardView>

                    <LinearGradient
                        locations={[0, 0.5, 0.8]}
                        colors={['#ccffff', '#99ffff', '#4dffff']}
                        style={{ margin: 8, borderRadius: 8, elevation: 3 }}>

                        <View style={{ flexDirection: 'row', margin: 12, marginTop: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                            <Text style={styles.styleTitle}>{"Biểu đồ của: "}</Text>

                            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => {
                                let params = {
                                    title: 'Chọn loại biểu đồ',
                                    id: "LoaiBieuDo",
                                    itemSelect: this.dataSelectLoaiBieuDo ? this.dataSelectLoaiBieuDo.id : null,
                                    dataList: dataLOAIBIEUDO,
                                }
                                this.showDialogChonItemFromList(true, params)
                            }}>
                                <Text style={[styles.styleTitle, { color: 'red', fontWeight: 'bold', fontSize: 16 }]}>{textTitleBieuDo}</Text>
                                <IconView
                                    style={{ justifyContent: 'center', alignItems: 'center', }}
                                    color='red'
                                    name={"arrow-down"}
                                    size={configs.sizeIcon20}
                                    height={configs.sizeIcon20}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <PieChart
                                data={this.dataChartDiMuon}
                                style={{ flex: 1 }}
                                width={Dimensions.get('window').width / 2}
                                height={Dimensions.get('window').width / 2}
                                chartConfig={{
                                    backgroundColor: "#ffffff",
                                    backgroundGradientFrom: "white",
                                    backgroundGradientTo: "white",
                                    decimalPlaces: 2, // optional, defaults to 2dp
                                    color: (opacity = 1) => `rgba(54,64,81, ${opacity})`,
                                }}
                                accessor="population"
                                backgroundColor="transparent"
                                absolute
                                avoidFalseZero={true}
                                hasLegend={false}
                                paddingLeft={Dimensions.get("window").width / 8}
                            />

                            <View style={{ justifyContent: 'space-around', flex: 1 }}>
                                {this.dataChartDiMuon.map((dataItem) => (
                                    <View style={{
                                        marginHorizontal: 10,
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }} key={dataItem.name}>
                                        <View style={{ backgroundColor: dataItem.color, width: 12, height: 12, borderRadius: 6 }} />
                                        {/* <Text style={styles.legendItemValue}>
                                        {dataItem.population
                                            ? dataItem[dataItem.population]
                                            : `${percentages[dataItem.name]}%`}
                                    </Text> */}

                                        <Text style={[styles.styleTitle, { fontSize: 12, marginLeft: 8 }]}>{dataItem.population + ' - Ngày ' + dataItem.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <Text style={[styles.styleTitle, {
                            paddingHorizontal: 12,
                            textAlign: 'center',
                            marginVertical: 12,
                            color: '#cc7a00',
                            fontWeight: 'bold'
                        }]}>{"Biểu đồ thống kê " + textTitleBieuDo + " trong 7 ngày gần đây"}</Text>
                    </LinearGradient>
                </ScrollView>

                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    height={configs.verticalScale(530)}
                    duration={250}
                    customStyles={{
                        container: {
                            borderTopRightRadius: 10, borderTopLeftRadius: 10,
                        }
                    }}
                >
                    {this.renderBottom()}
                </RBSheet>

                <DialogSelectItemFromList
                    isShowDialog={this.state.isShowDialog}
                    dataDialog={this.dataDialogChonItemFromList}
                    showDialog={this.showDialogChonItemFromList}
                    onDataSelectItem={this.setValueTextInput} />
            </BaseViewAdmin>
        )
    }
}
export const scrollX = new Animated.Value(0);

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

const mapStateToProps = state => ({
    ChartStatisticalReducer: state.ChartStatisticalReducer
});

const mapDispatchToProps = (dispatch) => {
    return {
        requestDataChartStatisAdmin: () => {
            api.requestDataChartStatisAdmin(dispatch)
        },
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ChartStatisticalScreen)