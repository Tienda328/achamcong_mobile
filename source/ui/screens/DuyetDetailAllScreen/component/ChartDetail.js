import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Animated, Dimensions, Text, BackHandler } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView, TextView, InputView, DialogSelectItemFromList } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'
import { BarChart, PieChart } from 'react-native-chart-kit'
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import Popover from 'react-native-popover-view';
import { models } from '../../../../commons/model';
import { actions } from '../../../../commons/action';
import { api } from '../../../../commons/api/Api';

class ChartDetail extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            isArrowShowCard: true,
            showPopover: false,
            textTitleBieuDo: "tháng " + (new Date().getMonth() + 1),
            reRender: false,
            isShowDialog: false
        }

        this.dataLogin = models.getDataLogin()
        this.dataDetail = {}
        try {
            this.dataDetail = this.props.dataDetail
            console.log("this.dataDetail:   " + JSON.stringify(this.dataDetail))
            //1 nghỉ phép, 2 xinddi muộn về sớm, 3 xin quen cham cong
            this.type = this.props.type
        } catch (error) {

        }

        this.dataDetailMount = []
        this.dataDetailAll = []
    }

    componentDidMount() {
        let params = {
            id: (this.dataLogin.id ? this.dataLogin.id : "")
        }
        console.log("Params" + JSON.stringify(params))
        this.props.getDetailTimeSheet(params)
    }

    componentWillUnmount() {
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.DuyetDetailAllReducer) {
            if (this.props.DuyetDetailAllReducer.dataDetailTimeSheet && this.props.DuyetDetailAllReducer.dataDetailTimeSheet !== prevProps.DuyetDetailAllReducer.dataDetailTimeSheet) {
                let dataDetail = this.props.DuyetDetailAllReducer.dataDetailTimeSheet
                if (dataDetail && dataDetail[0]) {
                    this.dataDetailMount = [
                        {
                            name: "Đi muộn, Về sớm",
                            population: dataDetail[0].month && dataDetail[0].month.action ? dataDetail[0].month.action : 0,
                            color: 'red',
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        },
                        {
                            name: 'Hợp lệ',
                            population: dataDetail[0].month && dataDetail[0].month.sabbatical ? dataDetail[0].month.sabbatical : 0,
                            color: 'rgb(54, 162, 235)',
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        },
                        {
                            name: "Nghỉ không lý do",
                            population: dataDetail[0].month && dataDetail[0].month.all && dataDetail[0].month.real ? parseInt(dataDetail[0].month.all) - parseInt(dataDetail[0].month.real) : 0,
                            color: 'rgb(255, 206, 86)',
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        },
                        {
                            name: 'Tổng công làm thực tế',
                            population: dataDetail[0].month && dataDetail[0].month.real ? dataDetail[0].month.real : 0,
                            color: 'rgb(75, 192, 192)',
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        },
                        {
                            name: 'Số đơn xin phép',
                            population: dataDetail[0].month && dataDetail[0].month.ticket ? dataDetail[0].month.ticket : 0,
                            color: "gray",
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }
                    ]
                    this.dataDetailAll = [
                        {
                            name: "Đi muộn, Về sớm",
                            population: dataDetail[0].all && dataDetail[0].all.action ? dataDetail[0].all.action : 0,
                            color: 'red',
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        },
                        {
                            name: 'Hợp lệ',
                            population: dataDetail[0].all && dataDetail[0].all.sabbatical ? dataDetail[0].all.sabbatical : 0,
                            color: 'rgb(54, 162, 235)',
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        },
                        {
                            name: "Nghỉ không lý do",
                            population: dataDetail[0].all && dataDetail[0].all.all && dataDetail[0].all.real ? parseInt(dataDetail[0].all.all) - parseInt(dataDetail[0].all.real) : 0,
                            color: 'rgb(255, 206, 86)',
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        },
                        {
                            name: 'Tổng công làm thực tế',
                            population: dataDetail[0].all && dataDetail[0].all.real ? dataDetail[0].all.real : 0,
                            color: 'rgb(75, 192, 192)',
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        },
                        {
                            name: 'Số đơn xin phép',
                            population: dataDetail[0].all && dataDetail[0].all.ticket ? dataDetail[0].all.ticket : 0,
                            color: "gray",
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }
                    ]
                    console.log("this.dataDetailMount:     " + JSON.stringify(this.dataDetailMount))
                    this.reRender()
                }
            }
        }
    }

    reRender = () => {
        this.setState(prevState => ({ reRender: prevState.reRender = !this.state.reRender }))
    }

    render() {
        let { isArrowShowCard, showPopover, textTitleBieuDo } = this.state
        return (
            <View style={{ height: '100%', flex: 1 }}>
                <ScrollView style={{ flex: 1 }}>
                    <LinearGradient
                        locations={[0, 0.5, 0.8]}
                        colors={['#ccffff', '#99ffff', '#4dffff']}
                        style={{ margin: 12, borderRadius: 8, elevation: 3, marginHorizontal: 6 }}>
                        <View style={{ flexDirection: 'row', margin: 12, marginTop: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                            <Text style={[styles.styleTitle, { fontWeight: 'bold', fontSize: 18 }]}>{"Loại biểu đồ trong tháng " + textTitleBieuDo}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <PieChart
                                data={this.dataDetailMount}
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
                                {this.dataDetailMount.map((dataItem) => (
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

                                        <Text style={[styles.styleTitle, { fontSize: 12, marginLeft: 8 }]}>{dataItem.population + ' - ' + dataItem.name}</Text>
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
                        }]}>{"Biểu đồ thống kê xin nghỉ của " + this.dataDetail?.user_request?.name + ' trong tháng ' + textTitleBieuDo}</Text>
                    </LinearGradient>

                    <LinearGradient
                        locations={[0, 0.5, 0.8]}
                        colors={['#ccffff', '#99ffff', '#4dffff']}
                        style={{ margin: 12, borderRadius: 8, elevation: 3, marginHorizontal: 6 }}>
                        <View style={{ flexDirection: 'row', margin: 12, marginTop: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                            <Text style={[styles.styleTitle, { fontWeight: 'bold', fontSize: 18 }]}>{"Loại biểu đồ tất cả các tháng "}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <PieChart
                                data={this.dataDetailAll}
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
                                {this.dataDetailAll.map((dataItem) => (
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

                                        <Text style={[styles.styleTitle, { fontSize: 12, marginLeft: 8 }]}>{dataItem.population + ' - ' + dataItem.name}</Text>
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
                        }]}>{"Biểu đồ thống kê xin nghỉ của " + this.dataDetail?.user_request?.name + ' trong tất cả các tháng'}</Text>
                    </LinearGradient>
                </ScrollView>
            </View>
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
})

const mapStateToProps = state => ({
    DuyetDetailAllReducer: state.DuyetDetailAllReducer
});

const mapDispatchToProps = (dispatch) => {
    return {
        showLoadding: () => {
            dispatch(actions.showLoading())
        },
        hideLoadding: () => {
            dispatch(actions.hideLoading())
        },
        getDetailTimeSheet: (params) => {
            api.getDetailTimeSheet(dispatch, params)
        }
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ChartDetail)