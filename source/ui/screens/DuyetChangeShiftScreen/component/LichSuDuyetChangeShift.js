import React from 'react';
import { StyleSheet, Alert, View, Text, RefreshControl } from 'react-native';
import { BaseComponent, IconView } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'
import { FlatList } from 'react-native-gesture-handler';
import RenderItemDuyetChangeShift from './RenderItemDuyetChangeShift';
import { models } from '../../../../commons/model';
import { actions } from '../../../../commons/action';
import { api } from '../../../../commons/api/Api';

class LichSuDuyetChangeShift extends BaseComponent {
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
        this.deleteDuyetChangeShift = this.deleteDuyetChangeShift.bind(this)
        this.navigateDetailDuyet = this.navigateDetailDuyet.bind(this)
    }

    componentDidMount() {
        console.log('DidMount LichSuDuyetChangeShift')
        this.getData()
    }

    getData = (page = this.pageIndex) => {
        let date = {}
        let params = {
            // ...{
            //     type: this.props.type,
            //     page: page,
            //     id_member: ''
            // }, ...date
        }
        params.date_start = '';
        params.date_end = '';
        params.type = this.props.type;
        this.props.getDataListDuyetChangeShift(params)
    }

    reRender = () => {
        this.setState(prevState => ({ reRender: prevState.reRender = !this.state.reRender }))
    }

    deleteDuyetChangeShift = (dataItem) => {
        // let params = dataItem
        // params.time_start = configs.quyDoiTimeStampToDate(dataItem.time_start_timestamp)
        // params.time_end = configs.quyDoiTimeStampToDate(dataItem.time_end_timestamp)
        // params.state = 1
        // params.id_reason = params.type
        // params.idPage = 1
        // this.props.deleteDuyetDiMuonVeSom(params)
    }

    navigateDetailDuyet = (item) => {
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('dataList lich su duyet change shift', this.props.DuyetChangeShiftReducer)
        if (this.props.DuyetChangeShiftReducer) {
            if (this.props.type === 1) {
                if (this.props.DuyetChangeShiftReducer.dataListDaDuyet !== prevProps.DuyetChangeShiftReducer.dataListDaDuyet) {
                    this.setState({
                        dataAll: this.props.DuyetChangeShiftReducer.dataListDaDuyet?.data
                    })
                }
            } else if (this.props.type === 2) {
                if (this.props.DuyetChangeShiftReducer.dataListTuChoi !== prevProps.DuyetChangeShiftReducer.dataListTuChoi) {
                    this.setState({
                        dataAll: this.props.DuyetChangeShiftReducer.dataListTuChoi?.data
                    })
                }
            }
            if (this.props.DuyetChangeShiftReducer.messageDelete && this.props.DuyetChangeShiftReducer.messageDelete !== prevProps.DuyetChangeShiftReducer.messageDelete) {
                setTimeout(() => {
                    Alert.alert(
                        configs.NAME_APP,
                        this.props.DuyetChangeShiftReducer.messageDelete.message,
                        [
                            {
                                text: 'Đồng ý', onPress: () => {
                                    this.props.requestDeleteDuyetChangeShiftChuaDuyet(null)
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
        if (isNext) {
            this.pageIndex++
        } else {
            this.pageIndex--
        }
        this.getData()
    }

    renderItemLSNghi = ({ item }) => {
        return (
            <RenderItemDuyetChangeShift
                dataItem={item}
                isDuyetLichSu={true}
                deleteDuyetChangeShift={this.deleteDuyetChangeShift}
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
                    showsHorizontalScrollIndicator={false}
                    renderItem={this.renderItemLSNghi}
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
    DuyetChangeShiftReducer: state.DuyetChangeShiftReducer
});

const mapDispatchToProps = (dispatch) => {
    return {
        showLoadding: () => {
            dispatch(actions.showLoading())
        },
        hideLoadding: () => {
            dispatch(actions.hideLoading())
        },
        getDataListDuyetChangeShift: (params) => {
            api.getDataListDuyetChangeShift(dispatch, params)
        },
        deleteDuyetChangeShift: (params) => {
            api.deleteDuyetChangeShift(dispatch, params)
        },
        requestDeleteDuyetChangeShiftChuaDuyet: () => {
            dispatch(actions.requestDeleteDuyetChangeShiftChuaDuyet())
        }
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(LichSuDuyetChangeShift);