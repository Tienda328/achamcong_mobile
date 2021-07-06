import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Text, RefreshControl } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import RenderItemLSNghi from './RenderItemDuyetNghiPhep'
import { models } from '../../../../commons/model';
import { actions } from '../../../../commons/action';
import { api } from '../../../../commons/api/Api';

class DuyetNghiPhep extends BaseComponent {
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
        this.deleteDuyetNghiPhep = this.deleteDuyetNghiPhep.bind(this)
        this.duyetNghiPhep = this.duyetNghiPhep.bind(this)
        this.navigateDetailDuyet = this.navigateDetailDuyet.bind(this)
        this.getData = this.getData.bind(this)
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
        this.props.getDataListDuyetNghiPhep(params)
    }

    reRender = () => {
        this.setState(prevState => ({ reRender: prevState.reRender = !this.state.reRender }))
    }

    deleteDuyetNghiPhep = (dataItem) => {
        let params = dataItem
        params.time_start = configs.quyDoiTimeStampToDate(dataItem.time_start_timestamp)
        params.time_end = configs.quyDoiTimeStampToDate(dataItem.time_end_timestamp)
        params.state = 1
        params.id_reason = params.type
        params.idPage = 0
        this.props.deleteDuyetNghiPhep(params)
    }

    duyetNghiPhep = (dataItem, isDuyet) => {
        let params = dataItem
        params.state_request = isDuyet? 1: 2
        params.id_reason = dataItem.type
        this.props.duyetNghiPhep(dataItem)
    }

    navigateDetailDuyet = (item) => {
        this.props.navigation.navigate('DuyetDetailAllScreen', { params: item, type: 1 })
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.DuyetNghiPhepReducer) {
            if (this.props.DuyetNghiPhepReducer.dataList !== prevProps.DuyetNghiPhepReducer.dataList) {
                this.setState({
                    dataAll: this.props.DuyetNghiPhepReducer.dataList?.data
                })
            }
            if (this.props.DuyetNghiPhepReducer.messageDeleteChuaDuyet && this.props.DuyetNghiPhepReducer.messageDeleteChuaDuyet !== prevProps.DuyetNghiPhepReducer.messageDeleteChuaDuyet) {
                setTimeout(() => {
                    Alert.alert(
                        configs.NAME_APP,
                        this.props.DuyetNghiPhepReducer.messageDeleteChuaDuyet.message,
                        [
                            {
                                text: 'Đồng ý', onPress: () => {
                                    this.props.requestDeleteDuyetNghiPhepChuaDuyet(null)
                                    this.getData(1)
                                }
                            }
                        ]
                    );
                }, 700);
            }
            if (this.props.DuyetNghiPhepReducer.dataMessageDuyetNghiPhep && this.props.DuyetNghiPhepReducer.dataMessageDuyetNghiPhep !== prevProps.DuyetNghiPhepReducer.dataMessageDuyetNghiPhep) {
                setTimeout(() => {
                    Alert.alert(
                        configs.NAME_APP,
                        this.props.DuyetNghiPhepReducer.dataMessageDuyetNghiPhep.message,
                        [
                            {
                                text: 'Đồng ý', onPress: () => {
                                    this.props.requestMessageDuyetNghiPhep(null)
                                    this.getData(1)
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
            this.getData()
        }, 700);
    }

    renderItemLSNghi = ({ item }) => {
        return (
            <RenderItemLSNghi
                dataItem={item}
                deleteDuyetNghiPhep={this.deleteDuyetNghiPhep}
                duyetNghiPhep={this.duyetNghiPhep}
                navigation={this.props.navigation}
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
                    // keyExtractor={item => item.toString()}
                    refreshControl={
                        <RefreshControl
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
    DuyetNghiPhepReducer: state.DuyetNghiPhepReducer
});

const mapDispatchToProps = (dispatch) => {
    return {
        showLoadding: () => {
            dispatch(actions.showLoading())
        },
        hideLoadding: () => {
            dispatch(actions.hideLoading())
        },
        getDataListDuyetNghiPhep: (params) => {
            api.getDataListDuyetNghiPhep(dispatch, params)
        },
        deleteDuyetNghiPhep: (params) => {
            api.deleteDuyetNghiPhep(dispatch, params)
        },
        requestDeleteDuyetNghiPhepChuaDuyet: () => {
            dispatch(actions.requestDeleteDuyetNghiPhepChuaDuyet())
        },


        duyetNghiPhep: (params) => {
            api.duyetNghiPhep(dispatch, params)
        },
        requestMessageDuyetNghiPhep: () => {
            dispatch(actions.requestMessageDuyetNghiPhep())
        }
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(DuyetNghiPhep)