import React from 'react';
import { StyleSheet, Alert, Animated, TouchableOpacity, View, Text, Platform, Image } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView, TextView, RadioForm, TabView } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'
import { actions } from '../../../../commons/action';
import { FlatList } from 'react-native-gesture-handler';

class DetailScreen extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            reRender: false,
            dataList: []
        }

        this.dataPhongBan = props.dataPhongBan
        this.dataChiNhanh = props.dataChiNhanh

        this.pageIndex = 0
        this.pageSize = 30
        this.page = this.props.id === 2 ? Math.ceil(this.dataPhongBan.length / this.pageSize): Math.ceil(this.dataChiNhanh.length / this.pageSize)

        this.nextPageList = this.nextPageList.bind(this)
    }

    getData() {
        var dataList = []
        if(this.props.id === 2) {
            dataList = this.dataPhongBan.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize)
        } else {
            dataList = this.dataChiNhanh.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize)
        }
        this.setState({
            dataList: dataList
        }, () => {
            console.log(this.state.dataList)
            this.props.hideLoadding()
        })
    }

    componentDidMount() {
        this.getData()
    }

    reRender = () => {
        this.setState(prevState => ({ reRender: prevState.reRender = !this.state.reRender }))
    }

    nextPageList = (isNext) => {
        this.props.showLoadding()
        setTimeout(() => {
            if (isNext) {
                this.pageIndex++
            } else {
                this.pageIndex--
            }
            this.getData()
        }, 700);
    }

    drawItemList(params) {
        return (
            <View style={{ flexDirection: 'row', flex: 1 }}>
                <TextView
                    style={styles.stylesRow}
                    stylesTextContent={styles.stylesTextContent}
                    styleTitle={styles.styleLabel}
                    styleValue={styles.styleValue}
                    title={params.title1}
                    value={params.value1}
                />
                {params.title2 && <TextView
                    style={[styles.stylesRow]}
                    stylesTextContent={styles.stylesTextContent}
                    styleTitle={styles.styleLabel}
                    styleValue={styles.styleValue}
                    title={params.title2}
                    value={params.value2}
                />}
            </View>
        )
    }

    renderItem = ({ item, index }) => {
        return (
            <View style={[styles.cardItem]}>
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: configs.colorMain,
                    minHeight: configs.height30,
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    paddingHorizontal: 12
                }}>
                    <Text style={[styles.styleTitle, { color: 'white', fontWeight: '500', flex: 1 }]}>{(index + 1 + this.pageIndex * this.pageSize) + '. ' + item.name}</Text>
                </View>

                {this.props.id === 1 ?
                    <View style={{ flex: 1 }}>
                        {this.drawItemList({
                            title1: "Thời gian tạo",
                            value1: item.created_at,
                            title2: "bán kính check in",
                            value2: item.radius_checkin,
                        })}
                        {this.drawItemList({
                            title1: "Địa chỉ",
                            value1: item.address,

                        })}
                    </View> :
                    <View style={{ flex: 1 }}>
                        {this.drawItemList({
                            title1: "Thời gian tạo",
                            value1: item.created_at,
                            title2: "Thời gian update gần nhất",
                            value2: item.updated_at,
                        })}
                    </View>}
            </View>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{
                    flexDirection: 'row',
                    backgroundColor: configs.colorBorder,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    height: configs.height50
                }}>
                    <TouchableOpacity
                        style={{
                            width: 50,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onPress={() => { this.props.closeSheet() }}>
                        <IconView
                            name={'cancel'}
                            size={configs.sizeIcon24}
                            color={configs.colorTitleCard}
                        />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>{this.props.id === 2 ? 'Danh sách phòng ban': 'Danh sách chi nhánh'} </Text>
                </View>

                <FlatList
                    style={{ flex: 1 }}
                    data={this.state.dataList}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id}
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
                        color={this.pageIndex !== 0 ? 'black' : 'gray'}
                        style={{ paddingHorizontal: 12 }}
                        onPress={() => {
                            if (this.pageIndex !== 0) {
                                this.nextPageList(false)
                            }
                        }}
                    />
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>{(this.pageIndex + 1) + '/' + this.page} </Text>
                    <IconView
                        name={'right-arrow'}
                        size={20}
                        color={(this.pageIndex + 1) !== this.page ? 'black' : 'gray'}
                        style={{ paddingHorizontal: 12 }}
                        onPress={() => {
                            if (this.pageIndex !== this.page) {
                                this.nextPageList(true)
                            }
                        }}
                    />
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
    stylesRow: {
        flex: 1,
        marginHorizontal: 8,
        paddingVertical: 8
    },

    stylesTextContent: {
    },

    styleLabel: {
        // fontStyle: 'normal',
        // fontSize: configs.fontSize13,
        // color: configs.colorText1,
    },

    styleValue: {
        fontSize: configs.fontSize13,
        color: 'black',
        marginLeft: 4

    },
    cardItem: {
        flex: 1,
        flexDirection: 'column',
        marginVertical: 6,
        marginHorizontal: 12,
        backgroundColor: 'white',
        borderRadius: 8,
        shadowRadius: 4,
        shadowColor: 'gray',
        elevation: 3,
        shadowOpacity: 0.5,
        shadowOffset: {
            height: 1,
            width: 0
        },
    },
})

const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch) => {
    return {
        showLoadding: () => {
            dispatch(actions.showLoading())
        },
        hideLoadding: () => {
            dispatch(actions.hideLoading())
        },
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(DetailScreen)