import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Text } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView, TextView } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'
import { ScrollView } from 'react-native-gesture-handler';

class BaoCaoScreen extends BaseComponent {
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

    render() {
        let { dataItem } = this.props
        let dateToArray = this.convertTachDate(dataItem.date)
        let textToDateThu = dateToArray.length < 3 ? '' : configs.quyDoiNgayThangSangThu(dateToArray[2], dateToArray[1], dateToArray[0])
        return (
            <TouchableOpacity onPress={() => { this.props.updateReadThongBao(dataItem) }} style={{
                flexDirection: 'row', marginHorizontal: 12, marginTop: 12, backgroundColor: dataItem.read ? 'white' : '#e6e6e6', borderRadius: 8, borderWidth: 0.5, borderColor: dataItem.read ? '#f2f2f2' : 'white',
                padding: 12,
                elevation: 3,
                shadowColor: 'gray',
                shadowOpacity: 0.5,
                shadowOffset: {
                    height: 1,
                    width: 1
                }
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

                <View style={{ paddingHorizontal: 12 }}>
                    {/* <TextView
                        style={{ marginBottom: -5 }}
                        styleValue={[styles.styleTitle, {
                            color: dataItem.state === 0 ? configs.colorDiMuon : (dataItem.state === 1 ? configs.colorDongY : "red"),
                            fontStyle: 'italic', fontSize: 9, marginLeft: -2
                        }]}
                        value={dataItem.state === 0 ? "Chưa duyệt" : (dataItem.state === 1 ? "Đồng ý" : "Từ chối")}
                        iconLeft={dataItem.state === 0 ? 'circle-sync' : (dataItem.state === 1 ? "verified" : "warning")}
                        iconColor={dataItem.state === 0 ? configs.colorDiMuon : (dataItem.state === 1 ? configs.colorDongY : "red")}
                        iconSize={9}
                    /> */}

                    <Text style={[styles.styleTitle, { color: 'black', fontWeight: 'bold', fontSize: 16 }]}>{dataItem.title ? dataItem.title : ''}</Text>
                    <Text style={[styles.styleTitle, { color: 'gray', fontSize: 9 }]}>{(dataItem.time ? dataItem.time : '') + ' - ' + (dataItem.date ? dataItem.date : '')}</Text>

                    <Text style={[styles.styleTitle, { color: 'black', marginTop: 12 }]}>{dataItem.content ? dataItem.content : ''}</Text>
                </View>
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
})

const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch) => {
    return {

    };
}
export default connect(mapStateToProps, mapDispatchToProps)(BaoCaoScreen)