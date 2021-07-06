import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Text, RefreshControl } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import RenderItemLSNghi from './RenderItemDuyetDiCongTac'
import { models } from '../../../../commons/model';
import { actions } from '../../../../commons/action';
import { api } from '../../../../commons/api/Api';

// var config = {
//     databaseURL: "https://attendanceninja.firebaseio.com",
//     projectId: "AIzaSyA1ghE1_jp5zg2XiVoEt9XXTLULuAwLAXk",
//     apiKey: "AIzaSyA1ghE1_jp5zg2XiVoEt9XXTLULuAwLAXk", appId: "1:857684987888:web:0d743565d3fa1f54475735",
// };
// if (!firebase.apps.length) {
// firebase.initializeApp(config);
// }
class DuyetDiCongTac extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            reRender: false,
            isReloadData: false,
            dataAll: []
        }

        this.dataLogin = models.getDataLogin()

        this.dataList = []
        this.dataListChuaLoc = []
        this.pageIndex = 1

        this.renderItemLSNghi = this.renderItemLSNghi.bind(this)
        this.deleteDuyetDiCongTac = this.deleteDuyetDiCongTac.bind(this)
        this.duyetDiCongTac = this.duyetDiCongTac.bind(this)
        this.navigateDetailDuyet = this.navigateDetailDuyet.bind(this)
    }

    componentDidMount() {
        this.getData()
    }

    getData = (page = this.pageIndex) => {
        // let date = configs.getStartEndDayMount()
        let date = {}
        let params = {
            ...{
                type: "0",
                page: page,
                id_member: ''
            }, ...date
        }
        this.props.getDataListDuyetDiCongTac(params)
    }

    reRender = () => {
        this.setState(prevState => ({ reRender: prevState.reRender = !this.state.reRender }))
    }

    deleteDuyetDiCongTac = (dataItem) => {
        let params = dataItem
        params.time_start = configs.quyDoiTimeStampToDate(dataItem.time_start_timestamp)
        params.time_end = configs.quyDoiTimeStampToDate(dataItem.time_end_timestamp)
        params.state = 1
        params.idPage = 0
        this.props.deleteDuyetDiCongTac(params)
    }

    duyetDiCongTac = (dataItem, isDuyet) => {
        dataItem.state_request = isDuyet ? 1 : 2
        dataItem.time_start = configs.quyDoiTimeStampToDate(dataItem.time_start_timestamp)
        dataItem.time_end = configs.quyDoiTimeStampToDate(dataItem.time_end_timestamp)
        this.props.responDuyetDiCongTac(dataItem)
    }

    navigateDetailDuyet = (item) => {
        this.props.navigation.navigate('DuyetDetailAllScreen', { params: item, type: 2 })
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.DuyetDiCongTacReducer) {
            if (this.props.DuyetDiCongTacReducer.dataList !== prevProps.DuyetDiCongTacReducer.dataList) {
                this.setState({
                    dataAll: this.props.DuyetDiCongTacReducer.dataList?.data
                })
            }
            if (this.props.DuyetDiCongTacReducer.messageDeleteChuaDuyet && this.props.DuyetDiCongTacReducer.messageDeleteChuaDuyet !== prevProps.DuyetDiCongTacReducer.messageDeleteChuaDuyet) {
                setTimeout(() => {
                    Alert.alert(
                        configs.NAME_APP,
                        this.props.DuyetDiCongTacReducer.messageDeleteChuaDuyet.message,
                        [
                            {
                                text: 'Đồng ý', onPress: () => {
                                    this.props.requestDeleteDuyetDiCongTacChuaDuyet(null)
                                    this.getData(1)
                                }
                            }
                        ]
                    );
                }, 700);
            }
            if (this.props.DuyetDiCongTacReducer.messageReponDiCongTac && this.props.DuyetDiCongTacReducer.messageReponDiCongTac !== prevProps.DuyetDiCongTacReducer.messageReponDiCongTac) {
                console.log("this.props.DuyetDiCongTacReducer.messageReponDiCongTac:    ", this.props.DuyetDiCongTacReducer.messageReponDiCongTac)
                setTimeout(() => {
                    Alert.alert(
                        configs.NAME_APP,
                        this.props.DuyetDiCongTacReducer.messageReponDiCongTac.message,
                        [
                            {
                                text: 'Đồng ý', onPress: () => {
                                    this.props.reponDuyetDiCongTac(null)
                                    this.getData(1)
                                }
                            }
                        ]
                    );
                }, 700);
            }
        }
    }

    renderItemLSNghi = ({ item }) => {
        return (
            <RenderItemLSNghi
                dataItem={item}
                deleteDuyetDiCongTac={this.deleteDuyetDiCongTac}
                duyetDiCongTac={this.duyetDiCongTac}
                onClickItem={this.navigateDetailDuyet}
            />
        )
    }

    render() {
        let { isReloadData, dataAll } = this.state
        return (
            <View style={{ backgroundColor: configs.bgNen, flex: 1 }}>

                <FlatList
                    style={{ backgroundColor: configs.bgNen }}
                    data={dataAll?.data}
                    // ItemSeparatorComponent={this.viewSeparator}
                    showsHorizontalScrollIndicator={false}
                    renderItem={this.renderItemLSNghi}
                    keyExtractor={item => item.id.toString()}
                    refreshControl={
                        < RefreshControl
                            refreshing={isReloadData}
                            onRefresh={() => { this.getData(1) }}
                        />
                    }
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
    DuyetDiCongTacReducer: state.DuyetDiCongTacReducer
});

const mapDispatchToProps = (dispatch) => {
    return {
        showLoadding: () => {
            dispatch(actions.showLoading())
        },
        hideLoadding: () => {
            dispatch(actions.hideLoading())
        },
        responDuyetDiCongTac: (params) => {
            api.responDuyetDiCongTac(dispatch, params)
        },
        reponDuyetDiCongTac: () => {
            dispatch(actions.reponDuyetDiCongTac())
        },
        getDataListDuyetDiCongTac: (params) => {
            api.getDataListDuyetDiCongTac(dispatch, params)
        },
        deleteDuyetDiCongTac: (params) => {
            api.deleteDuyetDiCongTac(dispatch, params)
        },
        requestDeleteDuyetDiCongTacChuaDuyet: () => {
            dispatch(actions.requestDeleteDuyetDiCongTacChuaDuyet())
        }
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(DuyetDiCongTac)