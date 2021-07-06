import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Text } from 'react-native';
import { BaseComponent, IconView, TextView } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'

class ItemChangeShift extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
        }

        this.deleteChangeShift = this.deleteChangeShift.bind(this)
    }

    convertTachDate(date) {
        if (!date) {
            return []
        }
        return date.split("-")
    }

    deleteChangeShift = () => {
        let { dataItem } = this.props
        Alert.alert(
            configs.NAME_APP,
            'Bạn có muốn xóa đơn xin chuyển ca này hay không?',
            [
                {
                    text: configs.DONG_Y, onPress: () => {
                        this.props.deleteChangeShift(dataItem)
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
        console.log('data change shift', dataItem);
        let { dataItem } = this.props
        let dateToArray = this.convertTachDate(dataItem.date)

        let textToDateThu = configs.quyDoiNgayThangSangThu1(dataItem.time_start_timestamp)
        return (
            <View style={{
                flexDirection: 'row', marginHorizontal: 12, marginTop: 12, backgroundColor: 'white', borderRadius: 8, borderWidth: 0.5, borderColor: '#737373',
                padding: 12
            }}>
                <View style={{
                    paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: configs.colorBorder, backgroundColor: '#f2f2f2',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 60
                }}>
                    <Text style={[styles.styleTitle, { color: 'black', fontWeight: 'bold', fontSize: 15 }]}>{textToDateThu}</Text>
                    <Text style={[styles.styleTitle, { color: 'red', fontSize: 9 }]}>{dateToArray.length < 3 ? '' : dateToArray[2] + ' Tháng ' + dateToArray[1]}</Text>
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

                    <Text style={[styles.styleTitle, { color: 'black', fontWeight: 'bold', fontSize: 16 }]}>{'Loại: ' + (dataItem.type == 1 ? 'Tăng ca' : 'Giảm ca')}</Text>
                    <Text style={[styles.styleTitle, { color: 'gray', fontSize: 10, marginVertical: 2 }]}>{'Ngày: ' + (dataItem.date ? dataItem.date : '')}</Text>
                    <Text style={[styles.styleTitle, { color: 'gray', fontSize: 10, marginVertical: 2 }]}>{('Từ: ' + (dataItem.time_start ? dataItem.time_start : '')) + ' -> ' + 'Đến: ' + (dataItem.time_end ? dataItem.time_end : '')}</Text>
                    <Text style={[styles.styleTitle, { color: 'gray', fontSize: 10, marginVertical: 2 }]}>{'Số ca: ' + (dataItem.shift ? dataItem.shift : '')}</Text>
                    <Text style={[styles.styleTitle, { color: 'gray', fontSize: 10, marginVertical: 2 }]}>{'Lý do: ' + (dataItem.content ? dataItem.content : '')}</Text>
                    {dataItem.note ? <Text style={[styles.styleTitle, { color: 'black', fontSize: 12, fontStyle: 'italic' }]}>{"Lý do duyệt: "}
                        <Text style={{ color: 'red', fontSize: 14, fontStyle: 'normal' }}>{dataItem.note}</Text></Text> : <View />}

                    <Text style={[styles.styleTitle, { color: 'black', marginTop: 12 }]}>{dataItem.content ? dataItem.content : ''}</Text>
                </View>

                {dataItem.state_request === 0 && <TouchableOpacity onPress={this.deleteChangeShift} style={{ alignItems: 'flex-end', padding: 8 }}>
                    <IconView
                        name={'recycle-bin'}
                        color={'red'}
                        size={16}
                    />
                </TouchableOpacity>}
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
export default connect(mapStateToProps, mapDispatchToProps)(ItemChangeShift);