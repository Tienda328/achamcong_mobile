import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Text } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView, TextView } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'
import { ScrollView } from 'react-native-gesture-handler';

const dataQuenChamCong = [
    {
        id: 3,
        title: 'Chưa chọn loại',
        value: 3
    },
    {
        id: 1,
        title: 'Quên check in',
        value: 0
    },
    {
        id: 2,
        title: 'Quên check out',
        value: 1
    },
]
class RenderItemLS extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    convertTachDate(date) {
        if (!date) {
            return []
        }
        return date.split("-")
    }

    deleteNghiPhep = () => {
        let { dataItem } = this.props
        Alert.alert(
            configs.NAME_APP,
            'Bạn có muốn xóa đơn này hay không?',
            [
                {
                    text: configs.DONG_Y, onPress: () => {
                        this.props.deleteQuenChamCong(dataItem)
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
        // console.log("dataItem:   " + JSON.stringify(dataItem))
        let dateToArray = this.convertTachDate(dataItem.date)
        let textToDateThu = dateToArray.length < 3 ? '' : configs.quyDoiNgayThangSangThu(dateToArray[2], dateToArray[1], dateToArray[0])
        // let textToDateThu = 1
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

                    <Text style={[styles.styleTitle, { color: 'black', fontWeight: 'bold', fontSize: 16 }]}>{dataItem.title ? dataItem.title : ''}</Text>
                    <Text style={[styles.styleTitle, { color: 'black', fontSize: 14 }]}>{'Tình trạng: '}
                        <Text style={{ color: 'red', fontWeight: 'bold' }}>{dataItem.type && dataQuenChamCong[dataItem.type] && dataQuenChamCong[dataItem.type].title ? dataQuenChamCong[dataItem.type].title : dataQuenChamCong[0].title}</Text></Text>
                    <Text style={[styles.styleTitle, { color: 'gray', fontSize: 9 }]}>{(dataItem.date ? configs.convertTimeDate(dataItem.date, configs.FORMAT_DATE_VN) : '')}</Text>

                    <Text style={[styles.styleTitle, { color: 'black', marginTop: 12 }]}>{dataItem.content ? dataItem.content : ''}</Text>
                </View>

                {dataItem.state_request === 0 ? <TouchableOpacity onPress={this.deleteNghiPhep} style={{ alignItems: 'flex-end', padding: 8 }}>
                    <IconView
                        name={'recycle-bin'}
                        color={'red'}
                        size={16}
                    />
                </TouchableOpacity> : <View />}
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
export default connect(mapStateToProps, mapDispatchToProps)(RenderItemLS)