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
class LichSuDuyetNghiPhep extends BaseComponent {
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
    }

    componentDidMount() {
        this.getData()
    }

    getData = (page = this.pageIndex) => {
        // let date = configs.getStartEndDayMount()
        let date = {}
        let params = {
            ...{
                type: this.props.type,
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
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.DuyetQuenChamCongReducer) {
            if (this.props.type === 1) {
                if (this.props.DuyetQuenChamCongReducer.dataListDaDuyet !== prevProps.DuyetQuenChamCongReducer.dataListDaDuyet) {
                    this.setState({
                        dataAll: this.props.DuyetQuenChamCongReducer.dataListDaDuyet?.data
                    })
                }
            } else if (this.props.type === 2) {
                if (this.props.DuyetQuenChamCongReducer.dataListTuChoi !== prevProps.DuyetQuenChamCongReducer.dataListTuChoi) {
                    this.setState({
                        dataAll: this.props.DuyetQuenChamCongReducer.dataListTuChoi?.data
                    })
                }
            }
            if (this.props.DuyetQuenChamCongReducer.messageDelete && this.props.DuyetQuenChamCongReducer.messageDelete !== prevProps.DuyetQuenChamCongReducer.messageDelete) {
                setTimeout(() => {
                    Alert.alert(
                        configs.NAME_APP,
                        this.props.DuyetQuenChamCongReducer.messageDelete.message,
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
                isDuyetLichSu={true}
                deleteDuyetQuenChamCong={this.deleteDuyetQuenChamCong}
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
export default connect(mapStateToProps, mapDispatchToProps)(LichSuDuyetNghiPhep)