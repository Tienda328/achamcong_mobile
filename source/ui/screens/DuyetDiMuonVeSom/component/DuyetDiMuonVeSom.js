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

// var config = {
//     databaseURL: "https://attendanceninja.firebaseio.com",
//     projectId: "AIzaSyA1ghE1_jp5zg2XiVoEt9XXTLULuAwLAXk",
//     apiKey: "AIzaSyA1ghE1_jp5zg2XiVoEt9XXTLULuAwLAXk", appId: "1:857684987888:web:0d743565d3fa1f54475735",
// };
// if (!firebase.apps.length) {
// firebase.initializeApp(config);
// }
class DuyetDiMuonVeSom extends BaseComponent {
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
        this.duyetDiMuonVeSom = this.duyetDiMuonVeSom.bind(this)
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
        this.props.getDataListDuyetDiMuonVeSom(params)
    }

    reRender = () => {
        this.setState(prevState => ({ reRender: prevState.reRender = !this.state.reRender }))
    }

    deleteDuyetNghiPhep = (dataItem) => {
        let params = dataItem
        params.state = 1
        params.idPage = 0
        this.props.deleteDuyetDiMuonVeSom(params)
    }

    duyetDiMuonVeSom = (dataItem, isDuyet) => {
        dataItem.state_request = isDuyet ? 1 : 2
        this.props.responDuyetDiMuonVeSom(dataItem)
    }

    navigateDetailDuyet = (item) => {
        this.props.navigation.navigate('DuyetDetailAllScreen', { params: item, type: 2 })
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.DuyetDiMuonVeSomReducer) {
            if (this.props.DuyetDiMuonVeSomReducer.dataList !== prevProps.DuyetDiMuonVeSomReducer.dataList) {
                this.setState({
                    dataAll: this.props.DuyetDiMuonVeSomReducer.dataList?.data
                })
            }
            if (this.props.DuyetDiMuonVeSomReducer.messageDeleteChuaDuyet && this.props.DuyetDiMuonVeSomReducer.messageDeleteChuaDuyet !== prevProps.DuyetDiMuonVeSomReducer.messageDeleteChuaDuyet) {
                setTimeout(() => {
                    Alert.alert(
                        configs.NAME_APP,
                        this.props.DuyetDiMuonVeSomReducer.messageDeleteChuaDuyet.message,
                        [
                            {
                                text: 'Đồng ý', onPress: () => {
                                    this.props.requestDeleteDuyetDiMuonVeSomChuaDuyet(null)
                                    this.getData(1)
                                }
                            }
                        ]
                    );
                }, 700);
            }
            if (this.props.DuyetDiMuonVeSomReducer.messageReponDiMuonVeSom && this.props.DuyetDiMuonVeSomReducer.messageReponDiMuonVeSom !== prevProps.DuyetDiMuonVeSomReducer.messageReponDiMuonVeSom) {
                console.log("this.props.DuyetDiMuonVeSomReducer.messageReponDiMuonVeSom:    ", this.props.DuyetDiMuonVeSomReducer.messageReponDiMuonVeSom)
                setTimeout(() => {
                    Alert.alert(
                        configs.NAME_APP,
                        this.props.DuyetDiMuonVeSomReducer.messageReponDiMuonVeSom.message,
                        [
                            {
                                text: 'Đồng ý', onPress: () => {
                                    this.props.reponDuyetDiMuonVeSom(null)
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
                deleteDuyetNghiPhep={this.deleteDuyetNghiPhep}
                duyetNghiPhep={this.duyetDiMuonVeSom}
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
    DuyetDiMuonVeSomReducer: state.DuyetDiMuonVeSomReducer
});

const mapDispatchToProps = (dispatch) => {
    return {
        showLoadding: () => {
            dispatch(actions.showLoading())
        },
        hideLoadding: () => {
            dispatch(actions.hideLoading())
        },
        responDuyetDiMuonVeSom: (params) => {
            api.responDuyetDiMuonVeSom(dispatch, params)
        },
        reponDuyetDiMuonVeSom: () => {
            dispatch(actions.reponDuyetDiMuonVeSom())
        },
        getDataListDuyetDiMuonVeSom: (params) => {
            api.getDataListDuyetDiMuonVeSom(dispatch, params)
        },
        deleteDuyetDiMuonVeSom: (params) => {
            api.deleteDuyetDiMuonVeSom(dispatch, params)
        },
        requestDeleteDuyetDiMuonVeSomChuaDuyet: () => {
            dispatch(actions.requestDeleteDuyetDiMuonVeSomChuaDuyet())
        }
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(DuyetDiMuonVeSom)