import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Text, RefreshControl } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import RenderItemLSNghi from './RenderItemLSNghi'
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
        this.deleteDuyetQuenChamCong = this.deleteDuyetQuenChamCong.bind(this)
        this.duyetQuenChamCong = this.duyetQuenChamCong.bind(this)
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
        this.props.getDataListDuyetQuenChamCong(params)
    }

    reRender = () => {
        this.setState(prevState => ({ reRender: prevState.reRender = !this.state.reRender }))
    }

    deleteDuyetQuenChamCong = (dataItem) => {
        let params = dataItem
        params.state = 1
        params.idPage = 0
        params.isAdmin = true
        this.props.deleteDuyetQuenChamCong(params)
    }

    duyetQuenChamCong = (dataItem, isDuyet) => {
        dataItem.state_request = isDuyet ? 1 : 2
        this.props.responDuyetQuenChamCong(dataItem)
    }

    navigateDetailDuyet = (item) => {
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.DuyetQuenChamCongReducer) {
            if (this.props.DuyetQuenChamCongReducer.dataList !== prevProps.DuyetQuenChamCongReducer.dataList) {
                this.setState({
                    dataAll: this.props.DuyetQuenChamCongReducer.dataList?.data
                })
            }
            if (this.props.DuyetQuenChamCongReducer.messageDeleteChuaDuyet && this.props.DuyetQuenChamCongReducer.messageDeleteChuaDuyet !== prevProps.DuyetQuenChamCongReducer.messageDeleteChuaDuyet) {
                setTimeout(() => {
                    Alert.alert(
                        configs.NAME_APP,
                        this.props.DuyetQuenChamCongReducer.messageDeleteChuaDuyet.message,
                        [
                            {
                                text: 'Đồng ý', onPress: () => {
                                    this.props.requestDeleteDuyetQuenChamCongChuaDuyet(null)
                                    this.getData(1)
                                }
                            }
                        ]
                    );
                }, 700);
            }
            if (this.props.DuyetQuenChamCongReducer.messageReponQuenChamCong && this.props.DuyetQuenChamCongReducer.messageReponQuenChamCong !== prevProps.DuyetQuenChamCongReducer.messageReponQuenChamCong) {
                setTimeout(() => {
                    Alert.alert(
                        configs.NAME_APP,
                        this.props.DuyetQuenChamCongReducer.messageReponQuenChamCong.message,
                        [
                            {
                                text: 'Đồng ý', onPress: () => {
                                    this.props.reponDuyetQuenChamCong(null)
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
                deleteDuyetQuenChamCong={this.deleteDuyetQuenChamCong}
                duyetQuenChamCong={this.duyetQuenChamCong}
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
    DuyetQuenChamCongReducer: state.DuyetQuenChamCongReducer
});

const mapDispatchToProps = (dispatch) => {
    return {
        showLoadding: () => {
            dispatch(actions.showLoading())
        },
        hideLoadding: () => {
            dispatch(actions.hideLoading())
        },
        responDuyetQuenChamCong: (params) => {
            api.responDuyetQuenChamCong(dispatch, params)
        },
        reponDuyetQuenChamCong: () => {
            dispatch(actions.reponDuyetQuenChamCong())
        },
        getDataListDuyetQuenChamCong: (params) => {
            api.getDataListDuyetQuenChamCong(dispatch, params)
        },
        deleteDuyetQuenChamCong: (params) => {
            api.deleteDuyetQuenChamCong(dispatch, params)
        },
        requestDeleteDuyetQuenChamCongChuaDuyet: () => {
            dispatch(actions.requestDeleteDuyetQuenChamCongChuaDuyet())
        }
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(DuyetNghiPhep)