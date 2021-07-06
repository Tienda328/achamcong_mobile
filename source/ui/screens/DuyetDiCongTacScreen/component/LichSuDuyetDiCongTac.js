import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Text, RefreshControl } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import RenderItemDuyetDiCongTac from './RenderItemDuyetDiCongTac'
import { models } from '../../../../commons/model';
import { actions } from '../../../../commons/action';
import { api } from '../../../../commons/api/Api';

// var config = {
//     databaseURL: "https://attendanceninja.firebaseio.com",
//     projectId: "AIzaSyA1ghE1_jp5zg2XiVoEt9XXTLULuAwLAXk",
//     apiKey: "AIzaSyA1ghE1_jp5zg2XiVoEt9XXTLULuAwLAXk", appId: "1:857684987888:web:0d743565d3fa1f54475735",
// };
// // if (!firebase.apps.length) {
// firebase.initializeApp(config);
// }
class LichSuDuyetDiCongTac extends BaseComponent {
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
        this.props.getDataListDuyetDiCongTac(params)
    }

    reRender = () => {
        this.setState(prevState => ({ reRender: prevState.reRender = !this.state.reRender }))
    }

    deleteDuyetDiCongTac = (dataItem) => {

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.DuyetDiCongTacReducer) {
            if (this.props.type === 1) {
                if (this.props.DuyetDiCongTacReducer.dataListDaDuyet !== prevProps.DuyetDiCongTacReducer.dataListDaDuyet) {
                    this.setState({
                        dataAll: this.props.DuyetDiCongTacReducer.dataListDaDuyet?.data
                    })
                }
            } else if (this.props.type === 2) {
                if (this.props.DuyetDiCongTacReducer.dataListTuChoi !== prevProps.DuyetDiCongTacReducer.dataListTuChoi) {
                    this.setState({
                        dataAll: this.props.DuyetDiCongTacReducer.dataListTuChoi?.data
                    })
                }
            }
            if (this.props.DuyetDiCongTacReducer.messageDelete && this.props.DuyetDiCongTacReducer.messageDelete !== prevProps.DuyetDiCongTacReducer.messageDelete) {
                setTimeout(() => {
                    Alert.alert(
                        configs.NAME_APP,
                        this.props.DuyetDiCongTacReducer.messageDelete.message,
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
            <RenderItemDuyetDiCongTac
                dataItem={item}
                isDuyetLichSu={true}
                deleteDuyetDiCongTac={this.deleteDuyetDiCongTac}
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
export default connect(mapStateToProps, mapDispatchToProps)(LichSuDuyetDiCongTac)