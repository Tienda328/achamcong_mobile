import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Text, RefreshControl, Dimensions } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import RenderItem from './RenderItemNghiPhep'
import ItemDiMuonVeSom from './ItemDiMuonVeSom'
import ItemQuenChamCong from './ItemQuenChamCong'
import ItemDiCongTac from './ItemDiCongTac'
import ItemChangeShift from './ItemChangeShift';
import { models } from '../../../../commons/model';
import { actions } from '../../../../commons/action';
import { api } from '../../../../commons/api/Api';

const { width } = Dimensions.get('window')
class BaoCaoScreen extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            reRender: false,
            isReloadData: false,
            dataAll: []
        }

        this.dataLogin = models.getDataLogin()
        this.type = this.props.type

        this.dataList = []
        this.dataListChuaLoc = []
        this.pageIndex = 1
        this.indexLoaiNghi = this.props.indexLoaiNghi
        this.dataDate = {}

        this.renderItemLSNghi = this.renderItemLSNghi.bind(this)
        this.deleteDuyetNghiPhep = this.deleteDuyetNghiPhep.bind(this)
        this.deleteOrder = this.deleteOrder.bind(this)
        this.deleteDiCongTac = this.deleteDiCongTac.bind(this)
        this.deleteChangeShift = this.deleteChangeShift.bind(this)
        this.reponseDataParams = this.reponseDataParams.bind(this)
        this.onData = this.onData.bind(this)
    }

    componentDidMount() {
        this.props.onRef(this)
        this.onData({
            ...{
                indexLoaiNghi: this.props.indexLoaiNghi
            }, ...this.dataDate
        })
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    onData = (params) => {
        // console.log("onData:    ")
        if (params.isResetDate) {
            this.dataDate = {
                date_start: params.date_start,
                date_end: params.date_end
            }
        }

        this.props.getDataHistoryOrder(this.reponseDataParams(params))
    }

    reponseDataParams = (data) => {
        this.indexLoaiNghi = data.indexLoaiNghi ? data.indexLoaiNghi : this.props.indexLoaiNghi
        let params = configs.getDataEndStartOfMounth()
        if (this.dataDate.date_end && this.dataDate.date_start) {
            params = this.dataDate
        }
        params.page = this.pageIndex
        params.type = this.type
        params.indexLoaiNghi = data.indexLoaiNghi ? data.indexLoaiNghi : this.props.indexLoaiNghi
        // console.log("params12313131:     ", params)
        return (params)
    }

    reRender = () => {
        this.setState(prevState => ({ reRender: prevState.reRender = !this.state.reRender }))
    }

    deleteDuyetNghiPhep = (dataItem) => {
        dataItem.indexLoaiNghi = this.indexLoaiNghi
        dataItem.id_reason = dataItem.type
        this.props.deleteItemOrder(dataItem)
    }

    deleteOrder = (dataItem) => {
        dataItem.indexLoaiNghi = this.indexLoaiNghi
        this.props.deleteItemOrder(dataItem)
    }

    deleteDiCongTac = (dataItem) => {
        dataItem.indexLoaiNghi = this.indexLoaiNghi
        dataItem.time_start = dataItem.date + ' ' + dataItem.time_start
        dataItem.time_end = dataItem.date + ' ' + dataItem.time_end
        this.props.deleteItemOrder(dataItem)
    }

    deleteChangeShift = (dataItem) => {
        dataItem.indexLoaiNghi = '5';
        this.props.deleteItemOrder(dataItem)
    }

    renderItemLSNghi = ({ item }) => {
        //1: Item Duyet nghỉ phep
        //2: di muon ve som
        //3: quen cham cong
        //4: di cong tac
        //5: chuyen doi ca
        if (this.props.indexLoaiNghi === "1") {
            return (
                <RenderItem
                    dataItem={item}
                    deleteDuyetNghiPhep={this.deleteDuyetNghiPhep}
                    indexLoaiNghi={this.props.indexLoaiNghi}
                />
            )
        } else if (this.props.indexLoaiNghi === "2") {
            return (
                <ItemDiMuonVeSom
                    dataItem={item}
                    deleteDiSomVeMuon={this.deleteOrder}
                    indexLoaiNghi={this.props.indexLoaiNghi}
                />
            )
        } else if (this.props.indexLoaiNghi === "3") {
            return (
                <ItemQuenChamCong
                    dataItem={item}
                    deleteQuenChamCong={this.deleteOrder}
                    indexLoaiNghi={this.props.indexLoaiNghi}
                />
            )
        } else if (this.props.indexLoaiNghi === "4") {
            return (
                <ItemDiCongTac
                    dataItem={item}
                    deleteDiCongTac={this.deleteDiCongTac}
                    indexLoaiNghi={this.props.indexLoaiNghi}
                />
            )
        } else if (this.props.indexLoaiNghi == '5') {
            return (
                <ItemChangeShift
                    dataItem={item}
                    deleteChangeShift={this.deleteChangeShift}
                    indexLoaiNghi={this.props.indexLoaiNghi}
                />
            )
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.HistoryXinPhepReducer) {
            if (this.type == 0) {
                if (this.props.HistoryXinPhepReducer.dataListChuaDuyet !== prevProps.HistoryXinPhepReducer.dataListChuaDuyet) {
                    this.dataList = this.props.HistoryXinPhepReducer.dataListChuaDuyet?.data?.data
                    // this.pageIndex = this.props.HistoryXinPhepReducer.dataListChuaDuyet?.data?.from
                    this.setState({
                        dataAll: this.props.HistoryXinPhepReducer.dataListChuaDuyet?.data,
                        reRender: !this.state.reRender
                    })
                }
            } else if (this.type == 1) {
                if (this.props.HistoryXinPhepReducer.dataListDaDuyet !== prevProps.HistoryXinPhepReducer.dataListDaDuyet) {
                    this.dataList = this.props.HistoryXinPhepReducer.dataListDaDuyet?.data?.data
                    // this.pageIndex = this.props.HistoryXinPhepReducer.dataListDaDuyet?.data?.from
                    this.setState({
                        dataAll: this.props.HistoryXinPhepReducer.dataListDaDuyet?.data,
                        reRender: !this.state.reRender
                    })
                }
            } else if (this.type == 2) {
                if (this.props.HistoryXinPhepReducer.dataListTuChoi !== prevProps.HistoryXinPhepReducer.dataListTuChoi) {
                    this.dataList = this.props.HistoryXinPhepReducer.dataListTuChoi?.data?.data
                    // this.pageIndex = this.props.HistoryXinPhepReducer.dataListTuChoi?.data?.from
                    this.setState({
                        dataAll: this.props.HistoryXinPhepReducer.dataListTuChoi?.data,
                        reRender: !this.state.reRender
                    })
                }
            }

            if (this.props.HistoryXinPhepReducer.messageDeleteOrder && this.props.HistoryXinPhepReducer.messageDeleteOrder !== prevProps.HistoryXinPhepReducer.messageDeleteOrder) {
                setTimeout(() => {
                    Alert.alert(
                        configs.NAME_APP,
                        this.props.HistoryXinPhepReducer.messageDeleteOrder.message,
                        [
                            {
                                text: 'Đồng ý', onPress: () => {
                                    this.props.requestDeleteItemOrder("")
                                    this.props.getDataHistoryOrder(this.reponseDataParams({ indexLoaiNghi: this.indexLoaiNghi }))
                                }
                            }
                        ]
                    );
                }, 700);
            }
        }
    }

    nextPageList = (isNext) => {
        // this.props.showLoadding()
        setTimeout(() => {
            if (isNext) {
                this.pageIndex++
            } else {
                this.pageIndex--
            }
            this.onData(this.indexLoaiNghi)
        }, 700);
    }

    renderEmptyContainer = () => {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
                <Image
                    source={require('../../../../assets/image/icon_history.png')}
                    style={{
                        width: width / 2,
                        height: width / 2
                    }}
                />
                <Text style={[styles.styleTitle, { fontWeight: 'bold', fontSize: 16 }]}>{'Bạn không có đơn xin phép nào.'}</Text>
            </View>
        )
    }

    render() {
        let { isReloadData } = this.state
        return (
            <View style={{ backgroundColor: configs.bgNen, flex: 1 }}>
                <FlatList
                    style={{ backgroundColor: configs.bgNen }}
                    data={this.dataList}
                    showsHorizontalScrollIndicator={false}
                    renderItem={this.renderItemLSNghi}
                    keyExtractor={item => item.id.toString()}
                    ListEmptyComponent={this.renderEmptyContainer()}
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
                        color={this.pageIndex !== 1 ? 'black' : 'gray'}
                        style={{ paddingHorizontal: 12 }}
                        onPress={() => {
                            if (this.pageIndex !== 1) {
                                this.nextPageList(false)
                            }
                        }}
                    />
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>{(this.pageIndex || "1") + '/' + (this.state.dataAll?.last_page || '0')} </Text>
                    <IconView
                        name={'right-arrow'}
                        size={20}
                        color={(this.pageIndex) !== this.state.dataAll?.last_page ? 'black' : 'gray'}
                        style={{ paddingHorizontal: 12 }}
                        onPress={() => {
                            if ((this.pageIndex) !== this.state.dataAll?.last_page) {
                                this.nextPageList(true)
                            }
                        }}
                    />

                    <View style={{ position: 'absolute', right: 12 }}>
                        <Text style={[styles.styleTitle, { fontSize: 10 }]}>{(this.state.dataAll?.to || "0") + '/' + (this.state.dataAll?.total || "0")}</Text>
                    </View>
                </View>
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
})

const mapStateToProps = state => ({
    HistoryXinPhepReducer: state.HistoryXinPhepReducer
});

const mapDispatchToProps = (dispatch) => {
    return {
        showLoadding: () => {
            dispatch(actions.showLoading())
        },
        hideLoadding: () => {
            dispatch(actions.hideLoading())
        },
        getDataHistoryOrder: (params) => {
            api.getDataHistoryOrder(dispatch, params)
        },
        deleteItemOrder: (params) => {
            api.deleteItemOrder(dispatch, params)
        },
        requestDeleteItemOrder: () => {
            dispatch(actions.requestDeleteItemOrder(""))
        }

    };
}
export default connect(mapStateToProps, mapDispatchToProps)(BaoCaoScreen)