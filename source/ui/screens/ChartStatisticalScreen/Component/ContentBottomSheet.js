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
        this.dataNhanVien = props.dataNhanVien
        this.pageIndex = 0
        this.pageSize = 30

        this.nextPageList = this.nextPageList.bind(this)
    }

    getData() {
        var dataList = this.dataNhanVien.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize)
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
        let phongBanArray = this.dataPhongBan.filter((itemPB) => { return itemPB.id === item.id_department })
        let chiNhanhArray = this.dataChiNhanh.filter((itemCN) => { return itemCN.id === item.id_branch })
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

                    <View style={{
                        paddingVertical: 4, paddingHorizontal: 12,
                        borderWidth: 0.5,
                        backgroundColor: 'white',
                        borderRadius: 8,
                        marginVertical: 8
                    }}>
                        <Text style={{
                            marginVertical: 4
                        }}>{item.role && item.role.description ? item.role.description : ''}</Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>

                    <Image
                        source={{ uri: item.avatar }} style={[{
                            width: 40,
                            height: 40,
                            borderRadius: 40 / 2,
                            marginLeft: 12
                        }]}
                    />

                    <View style={{ flex: 1 }}>
                        {this.drawItemList({
                            title1: "Email",
                            value1: item.email,

                        })}
                        {this.drawItemList({
                            title1: "Số điện thoại",
                            value1: item.phone,
                            title2: "Giới tính",
                            value2: item.sex === 1 ? "Nam" : "Nữ",
                        })}
                        {this.drawItemList({
                            title1: "Phòng ban",
                            value1: phongBanArray[0] && phongBanArray[0].description ? phongBanArray[0].description : "",
                            title2: "Phép năm còn lại",
                            value2: item.date_free,
                        })}
                        {this.drawItemList({
                            title1: "Sinh nhật",
                            value1: item.birth_day,
                            title2: "Chi nhánh",
                            value2: chiNhanhArray[0] && chiNhanhArray[0].name ? chiNhanhArray[0].name : "",
                        })}
                    </View>
                </View>
            </View>
        )
    }

    render() {
        let page = Math.ceil(this.dataNhanVien.length / this.pageSize)
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

                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>{'Danh sách nhân viên'} </Text>
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
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>{(this.pageIndex + 1) + '/' + page} </Text>
                    <IconView
                        name={'right-arrow'}
                        size={20}
                        color={(this.pageIndex + 1) !== page ? 'black' : 'gray'}
                        style={{ paddingHorizontal: 12 }}
                        onPress={() => {
                            if ((this.pageIndex + 1) !== page) {
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