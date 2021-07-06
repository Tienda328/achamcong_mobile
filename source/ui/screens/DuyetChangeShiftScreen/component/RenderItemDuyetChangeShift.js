import React from 'react';
import { StyleSheet, Alert, TouchableOpacity, View, Text } from 'react-native';
import { BaseComponent, IconView, TextView } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'

const ListLoaiXin = [
    'Không xác định',
    'Tăng ca',
    'Giảm ca'
]

class RenderItemDuyetChangeShift extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
        }

        this.deleteDuyetChangeShift = this.deleteDuyetChangeShift.bind(this)
        this.chapNhanDuyetChangeShift = this.chapNhanDuyetChangeShift.bind(this)
        this.tuChoiDuyetChangeShift = this.tuChoiDuyetChangeShift.bind(this)
        this.onClickItem = this.onClickItem.bind(this)
    }

    convertTachDate(date) {
        if (!date) {
            return []
        }
        return date.split("-")
    }

    deleteDuyetChangeShift = () => {
        let { dataItem } = this.props
        Alert.alert(
            configs.NAME_APP,
            'Bạn có muốn xóa chuyển ca của: ' + dataItem?.user_request?.name + ' này hay không?',
            [
                {
                    text: configs.DONG_Y, onPress: () => {
                        this.props.deleteDuyetChangeShift(dataItem)
                    }
                },
                {
                    text: configs.HUY, onPress: () => {
                    }
                },
            ],
        );
    }

    chapNhanDuyetChangeShift = () => {
        let { dataItem } = this.props
        this.props.duyetChangeShift(dataItem, true)

    }

    tuChoiDuyetChangeShift = () => {
        let { dataItem } = this.props
        this.props.duyetChangeShift(dataItem, false)
    }

    onClickItem = () => {
        let { dataItem } = this.props
        this.props.onClickItem(dataItem)
    }

    render() {
        console.log('render RenderItemChangeShift', this.props.dataItem);
        let { dataItem, isDuyetLichSu = false } = this.props;
        let textToDateThu = configs.quyDoiNgayThangSangThu3(dataItem.time_start_timestamp)
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
                        <Text style={[styles.styleTitle, { color: 'red', fontSize: 9 }]}>{dataItem.type ? ListLoaiXin[dataItem.type] : ''}</Text>
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

                            {dataItem.state_request === 0 && <TouchableOpacity onPress={this.deleteDuyetChangeShift} style={{ padding: 8 }}>
                                <IconView
                                    name={'recycle-bin'}
                                    color={'red'}
                                    size={16}
                                />
                            </TouchableOpacity>}
                        </View>
                        <Text style={[styles.styleTitle, { color: 'black', fontWeight: 'bold', fontSize: 16 }]}>{dataItem.title ? dataItem.title : ''}</Text>
                        <Text style={[styles.styleTitle, { color: 'black', fontWeight: 'bold', fontSize: 10, marginVertical: 2 }]}>{'Số ca: ' + (String(dataItem.shift) ? String(dataItem.shift) : '')}</Text>
                        <Text style={[styles.styleTitle, { color: 'gray', fontSize: 10, marginVertical: 2 }]}>{'Ngày: ' + (dataItem.date ? dataItem.date : '')}</Text>
                        <Text style={[styles.styleTitle, { color: 'gray', fontSize: 10, marginVertical: 2 }]}>{(dataItem.time_start ? dataItem.time_start : '') + ' -> ' + (dataItem.time_end ? dataItem.time_end : '')}</Text>

                        <Text style={[styles.styleTitle, { color: 'black', marginTop: 12 }]}>{dataItem.content ? dataItem.content : ''}</Text>
                        {dataItem.note ? <Text style={[styles.styleTitle, { color: 'black', marginTop: 10 }]}>{"Lý do " + (dataItem.state === 1 ? "chấp thuận: " : "từ chối: ") + dataItem.note}</Text> : <View />}
                    </View>
                </View>

                {!isDuyetLichSu && <View style={{ flexDirection: 'row', marginTop: 15 }}>
                    <TextView
                        onPress={this.chapNhanDuyetChangeShift}
                        style={[styles.styleButton, { flex: 3, marginLeft: 0 }]}
                        styleValue={[styles.styleTextButton, {}]}
                        value={"Duyệt"}
                        iconLeft={'verified'}
                        iconColor={'white'}
                        iconSize={14}
                    />
                    <TextView
                        onPress={this.tuChoiDuyetChangeShift}
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
})

const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch) => {
    return {

    };
}
export default connect(mapStateToProps, mapDispatchToProps)(RenderItemDuyetChangeShift);