import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Text } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView, TextView } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'
import { ScrollView } from 'react-native-gesture-handler';

const dataRadio = [
    'Không xác định',
    'Nghỉ nửa ngày',
    'Nghỉ một ngày',
    'Nghỉ nhiều ngày',
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
        let textFromDateThu = configs.quyDoiNgayThangSangThu3(dataItem.time_start_timestamp)
        let textToDateThu = configs.quyDoiNgayThangSangThu3(dataItem.time_end_timestamp)
        return (
            <TouchableOpacity onPress={this.onClickItem} style={{
                marginHorizontal: 12, marginTop: 12, backgroundColor: 'white', borderRadius: 8, borderWidth: 0.5, borderColor: '#737373',
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
                        <Text style={[styles.styleTitle, { color: 'black', fontWeight: 'bold', fontSize: 15 }]}>{textToDateThu === textFromDateThu ? textFromDateThu : textFromDateThu + ' - ' + textToDateThu}</Text>
                        {/* <Text style={[styles.styleTitle, { color: 'red', fontSize: 9 }]}>{dateToArray.length < 3 ? '' : dateToArray[2] + ' Tháng ' + dateToArray[1]}</Text> */}
                        <Text style={[styles.styleTitle, { color: 'red', fontSize: 9 }]}>{"Số công: " + dataItem.total_shift}</Text>
                    </View>

                    <View style={{ marginLeft: 12, flex: 1 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TextView
                                style={{ marginBottom: -5, flex: 1 }}
                                styleValue={[styles.styleTitle, {
                                    color: dataItem.state_request === 0 ? configs.colorDiMuon : (dataItem.state_request === 1 ? configs.colorDongY : "red"),
                                    fontStyle: 'italic', fontSize: 9, marginLeft: -2
                                }]}
                                value={dataItem.state_request === 0 ? "Chưa duyệt" : (dataItem.state_request === 1 ? "Đồng ý" : "Từ chối")}
                                iconLeft={dataItem.state_request === 0 ? 'circle-sync' : (dataItem.state_request === 1 ? "verified" : "warning")}
                                iconColor={dataItem.state_request === 0 ? configs.colorDiMuon : (dataItem.state_request === 1 ? configs.colorDongY : "red")}
                                iconSize={9}
                            />

                            <TouchableOpacity onPress={this.deleteDuyetNghiPhep} style={{ padding: 8 }}>
                                <IconView
                                    name={'recycle-bin'}
                                    color={'red'}
                                    size={16}
                                />
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.styleTitle, { color: configs.colorText, fontSize: 14 }]}>{"Tên: " + dataItem?.user_request?.name}</Text>
                        <Text style={[styles.styleTitle, { color: 'black', fontWeight: 'bold', fontSize: 16 }]}>{dataItem.title ? dataItem.title : ''}</Text>
                        <Text style={[styles.styleTitle, { color: 'gray', fontSize: 9 }]}>{(dataItem.time_start ? dataItem.time_start : '') + (dataItem.time_end ? ' -> ' + dataItem.time_end : '')}</Text>

                        {dataItem.user_accept && dataItem.user_accept.name ? <Text style={[styles.styleTitle, { color: 'black', marginTop: 8 }]}>{"Người duyệt: " + dataItem?.user_accept?.name}</Text> : <View />}
                        {dataItem.note ? <Text style={[styles.styleTitle, { color: 'black', marginTop: 8 }]}>{"Lý do duyệt: " + dataItem.note}</Text> : <View />}
                        
                        <Text style={[styles.styleTitle, { color: 'black', marginTop: 12 }]}>{dataItem.content ? dataItem.content : ''}</Text>
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
        paddingVertical: 8,
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