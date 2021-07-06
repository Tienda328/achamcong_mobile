import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Text } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView, TextView } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'
import { ScrollView } from 'react-native-gesture-handler';

const ListLoaiXin = [
    'Không xác định',
    'Xin đi trễ',
    'Xin về sớm'
]

class RenderItemDuyetNghiPhep extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
        }

        this.deleteDuyetNghiPhep = this.deleteDuyetNghiPhep.bind(this)
        this.chapNhanDuyetNghiPhep = this.chapNhanDuyetNghiPhep.bind(this)
        this.tuChoiDuyetNghiPhep = this.tuChoiDuyetNghiPhep.bind(this)
        this.onClickItem = this.onClickItem.bind(this)
    }

    convertTachDate(date) {
        if (!date) {
            return []
        }
        return date.split("-")
    }

    deleteDuyetNghiPhep = () => {
        let { dataItem } = this.props
        Alert.alert(
            configs.NAME_APP,
            'Bạn có muốn xóa nghỉ phép của: ' + dataItem?.user_request?.name + ' này hay không?',
            [
                {
                    text: configs.DONG_Y, onPress: () => {
                        this.props.deleteDuyetNghiPhep(dataItem)
                    }
                },
                {
                    text: configs.HUY, onPress: () => {

                    }
                },
            ],
        );
    }

    chapNhanDuyetNghiPhep = () => {
        let { dataItem } = this.props
        this.props.duyetNghiPhep(dataItem, true)

    }

    tuChoiDuyetNghiPhep = () => {
        let { dataItem } = this.props
        this.props.duyetNghiPhep(dataItem, false)
    }

    onClickItem = () => {
        let { dataItem } = this.props
        this.props.onClickItem(dataItem)
    }

    render() {
        let { dataItem, isDuyetLichSu = false } = this.props
        // let dateToArray = this.convertTachDate(dataItem.date)
        // let textToDateThu = dateToArray.length < 3 ? '' : configs.quyDoiNgayThangSangThu(dateToArray[2], dateToArray[1], dateToArray[0])

        let textToDateThu = configs.quyDoiNgayThangSangThu3(dataItem.time_timestamp)
        return (
            <TouchableOpacity onPress={this.onClickItem} style={{
                marginHorizontal: 8, marginTop: 8, backgroundColor: 'white', borderRadius: 8, borderWidth: 0.5, borderColor: '#737373',
                padding: 12
            }}>
                <View style={{
                    flexDirection: 'row'
                }}>
                    <View style={{
                        paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: configs.colorBorder, backgroundColor: '#f2f2f2',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 60
                    }}>
                        <Text style={[styles.styleTitle, { color: 'black', fontWeight: 'bold', fontSize: 15 }]}>{textToDateThu ? textToDateThu : ""}</Text>
                        {/* <Text style={[styles.styleTitle, { color: 'red', fontSize: 9 }]}>{dateToArray.length < 3 ? '' : dateToArray[2] + ' Tháng ' + dateToArray[1]}</Text> */}
                        <Text style={[styles.styleTitle, { color: 'red', fontSize: 9 }]}>{dataItem.type? ListLoaiXin[dataItem.type]: ''}</Text>
                    </View>

                    <View style={{ paddingHorizontal: 12, flex: 1 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <TextView
                                    style={{ marginBottom: -5 }}
                                    styleValue={[styles.styleTitle, {
                                        color: dataItem.state_request === 0 ? configs.colorDiMuon : (dataItem.state_request === 1 ? configs.colorDongY : "red"),
                                        fontStyle: 'italic', fontSize: 9, marginLeft: -2
                                    }]}
                                    value={dataItem.state_request === 0 ? "Chưa duyệt" : (dataItem.state_request === 1 ? "Đồng ý" : "Từ chối")}
                                    iconLeft={dataItem.state_request === 0 ? 'circle-sync' : (dataItem.state_request === 1 ? "verified" : "warning")}
                                    iconColor={dataItem.state_request === 0 ? configs.colorDiMuon : (dataItem.state_request === 1 ? configs.colorDongY : "red")}
                                    iconSize={9}
                                />

                                <Text style={[styles.styleTitle, { color: configs.colorText, fontSize: 14 }]}>{"Tên: " + (dataItem?.user_request?.name ? dataItem?.user_request?.name : '')}</Text>
                            </View>

                            {dataItem.state_request === 0 && <TouchableOpacity onPress={this.deleteDuyetNghiPhep} style={{ padding: 8 }}>
                                <IconView
                                    name={'recycle-bin'}
                                    color={'red'}
                                    size={16}
                                />
                            </TouchableOpacity>}
                        </View>
                        <Text style={[styles.styleTitle, { color: 'black', fontWeight: 'bold', fontSize: 16 }]}>{dataItem.title ? dataItem.title : ''}</Text>
                        <Text style={[styles.styleTitle, { color: 'gray', fontSize: 9 }]}>{(dataItem.time ? dataItem.time : '') + ' -> ' + (dataItem.date ? dataItem.date : '')}</Text>

                        <Text style={[styles.styleTitle, { color: 'black', marginTop: 12 }]}>{dataItem.content ? dataItem.content : ''}</Text>
                        {dataItem.note ? <Text style={[styles.styleTitle, { color: 'black', marginTop: 12 }]}>{"Lý do " + (dataItem.state === 1 ? "chấp thuận: " : "từ chối: ") + dataItem.note}</Text> : <View />}
                    </View>
                </View>

                {!isDuyetLichSu && <View style={{ flexDirection: 'row', marginTop: 15 }}>
                    <TextView
                        onPress={this.chapNhanDuyetNghiPhep}
                        style={[styles.styleButton, { flex: 3, marginLeft: 0 }]}
                        styleValue={[styles.styleTextButton, {}]}
                        value={"Duyệt"}
                        iconLeft={'verified'}
                        iconColor={'white'}
                        iconSize={14}
                    />
                    <TextView
                        onPress={this.tuChoiDuyetNghiPhep}
                        style={[styles.styleButton, { flex: 2, backgroundColor: configs.colorDiMuon, borderColor: configs.colorTextOrange, }]}
                        styleValue={[styles.styleTextButton, {}]}
                        value={"Từ chối"}
                        iconLeft={'parcel-refuse'}
                        iconColor={'white'}
                        iconSize={14}
                    />
                </View>}

                {/* <View style={{
                    flexDirection: 'row',
                    marginTop: 10
                }}>
                    {!isDuyetLichSu && <View style={{ width: (configs.SCREEN_WIDTH - 40) / 3, alignItems: 'flex-start', flex: 1 }}>
                        <TextView
                            onPress={this.tuChoiDuyetNghiPhep}
                            style={[styles.styleButton, { marginHorizontal: 10 }]}
                            styleValue={{ fontWeight: '500', fontSize: configs.fontSize12, color: 'red' }}
                            value={'Từ chối'}
                            iconLeft={'warning'}
                            iconColor={'red'}
                            iconSize={configs.sizeIcon12}
                        />
                    </View>}
                    {!isDuyetLichSu && <View style={{ width: (configs.SCREEN_WIDTH - 40) / 3, alignItems: 'flex-start', flex: 1 }}>
                        <TextView
                            onPress={this.chapNhanDuyetNghiPhep}
                            style={[styles.styleButton, { borderRightWidth: 0, }]}
                            styleValue={{ fontWeight: '500', fontSize: configs.fontSize12, color: configs.colorMain }}
                            value={'Duyệt'}
                            iconLeft={'verified'}
                            iconColor={configs.colorMain}
                            iconSize={configs.sizeIcon12}
                        />
                    </View>}
                    <View style={{ width: (configs.SCREEN_WIDTH - 40) / 3, alignItems: 'flex-end', flex: 1 }}>
                        <TextView
                            onPress={this.onClickItem}
                            style={[styles.styleButton]}
                            styleValue={{ fontWeight: '500', fontSize: configs.fontSize12, color: '#ff9933' }}
                            value={'Xem chi tiết >>>'}
                        // iconLeft={'change-package'}
                        // iconColor={configs.colorMain}
                        // iconSize={configs.sizeIcon12}
                        />

                    </View>
                </View> */}
            </TouchableOpacity>
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
    // styleButton: {
    //     flex: 1,
    //     backgroundColor: configs.colorDongY,
    //     marginLeft: 8,
    //     height: 34, borderRadius: 17,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     marginTop: 12,

    // },
    styleTextButton: {
        color: 'white',
        fontSize: configs.fontSize14_5,
        fontFamily: 'Lato-Regular',
    },
    styleButton: {
        backgroundColor: configs.colorMain,
        height: configs.heightInput40,
        borderColor: configs.colorMainDaiMau2,
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        paddingVertical: 12,
        marginLeft: configs.margin15
    },
    // styleButton: {
    //     // flex: 1,
    //     paddingHorizontal: 8,
    //     flexDirection: 'row',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     backgroundColor: '#ddddbb',
    //     borderRadius: 50
    // },
})

const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch) => {
    return {

    };
}
export default connect(mapStateToProps, mapDispatchToProps)(RenderItemDuyetNghiPhep)