import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Text } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView, TextView } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'
import { ScrollView } from 'react-native-gesture-handler';
const dataRadio = [
    {
        id: 1,
        title: 'Không xác định',
        value: 1
    },
    {
        id: 2,
        title: 'Xin nghỉ nửa ngày',
        value: 2
    },
    {
        id: 3,
        title: 'Xin nghỉ một hoặc nhiều ngày',
        value: 3
    },
]

class ItemDiCongTac extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    convertTachDate(date) {
        if (!date) {
            return []
        }

        console.log("date   ", date)
        let dateAr = date.split(" ")
        date = dateAr.length > 0 ? dateAr[1] : ""
        console.log(date)
        return date.split("-")
    }

    deleteNghiPhep = () => {
        let { dataItem } = this.props
        Alert.alert(
            configs.NAME_APP,
            'Bạn có muốn xóa đơn đi công tác này hay không?',
            [
                {
                    text: configs.DONG_Y, onPress: () => {
                        this.props.deleteDiCongTac(dataItem)
                    }
                },
                {
                    text: configs.HUY, onPress: () => {

                    }
                },
            ],
        );
    }

    render() {
        let { dataItem } = this.props
        // let dateToArray = this.convertTachDate(dataItem.time_start)
        // let textToDateThu = dateToArray.length < 3 ? '' : configs.quyDoiNgayThangSangThu1(dateToArray[0] + '-' + dateToArray[1] + '-' + dateToArray[2] + "T00:00:00")
        // let dateFromArray = this.convertTachDate(dataItem.time_end)
        // let textFromDateThu = dateFromArray.length < 3 ? '' : configs.quyDoiNgayThangSangThu1(dateFromArray[0] + '-' + dateFromArray[1] + '-' + dateFromArray[2] + "T00:00:00")

        let textToDateThu = configs.quyDoiNgayThangSangThu1(dataItem.time_start_timestamp)
        let textFromDateThu = configs.quyDoiNgayThangSangThu1(dataItem.time_end_timestamp)

        return (
            <View style={{
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
                        <Text style={[styles.styleTitle, { color: 'black', fontWeight: 'bold', fontSize: 15 }]}>{textToDateThu === textFromDateThu ? textToDateThu : textToDateThu + ' - ' + textFromDateThu}</Text>
                    </View>

                    <View style={{ paddingHorizontal: 12, flex: 1 }}>
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

                        <Text style={[styles.styleTitle, { color: 'black', fontWeight: 'bold', fontSize: 16 }]}>{(dataItem.name_customer ? dataItem.name_customer : '')}</Text>
                        <Text style={[styles.styleTitle, { color: 'gray', fontSize: 9 }]}>{(dataItem.time_start ? dataItem.time_start : '') + (dataItem.time_end ? ' -> ' + dataItem.time_end : '')}</Text>

                        {dataItem.note ? <Text style={[styles.styleTitle, { color: 'black', fontSize: 12, fontStyle: 'italic' }]}>{"Lý do duyệt: "}
                            <Text style={{ color: 'red', fontSize: 14, fontStyle: 'normal' }}>{dataItem.note}</Text></Text> : <View />}

                        {/* <Text style={[styles.styleTitle, { color: 'black', marginTop: 12 }]}>{"Số điện thoại: " + (dataItem.content ? dataItem.content : '')}</Text>
                    <Text style={[styles.styleTitle, { color: 'black', marginTop: 8 }]}>{"Địa chỉ: " + (dataItem.address ? dataItem.address : '')}</Text> */}
                    </View>

                    {dataItem.state_request === 0 && <TouchableOpacity onPress={this.deleteNghiPhep} style={{ alignItems: 'flex-end', padding: 8 }}>
                        <IconView
                            name={'recycle-bin'}
                            color={'red'}
                            size={16}
                        />
                    </TouchableOpacity>}
                </View>

                <View style={{ flexDirection: 'row', flex: 1, width: '100%', paddingHorizontal: 8 }}>
                    <TextView
                        style={[styles.styleTitle, { flex: 1 }]}
                        styleValue={styles.styleTitle, { color: 'black' }}
                        title={"Số điện thoại:"}
                        value={(dataItem.phone_customer ? dataItem.phone_customer : '')}
                        iconLeft='telephone'
                        iconColor={configs.colorIcon}
                        iconSize={configs.sizeIcon18}
                    />
                    <TextView
                        style={[styles.styleTitle, { flex: 1 }]}
                        styleValue={styles.styleTitle, { color: 'black' }}
                        title={"Địa chỉ: "}
                        value={(dataItem.address ? dataItem.address : '')}
                        iconLeft='map-item'
                        iconColor={configs.colorIcon}
                        iconSize={configs.sizeIcon18}
                    />
                </View>

                <Text style={[styles.styleTitle, { color: 'black', marginTop: 8 }]}>{dataItem.content ? dataItem.content : ''}</Text>
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
});

const mapDispatchToProps = (dispatch) => {
    return {

    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ItemDiCongTac)