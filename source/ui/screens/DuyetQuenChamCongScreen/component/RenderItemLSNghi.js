import React from 'react';
import { StyleSheet, Alert, Image, TouchableOpacity, View, Text } from 'react-native';
import { BaseComponent, BaseView, CardView, IconView, TextView } from '../../../components';
import { connect } from 'react-redux';
import { commonsConfigs as configs } from '../../../../commons'
import { ScrollView } from 'react-native-gesture-handler';

class RenderItemDuyetNghiPhep extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
        }

        this.deleteDuyetQuenChamCong = this.deleteDuyetQuenChamCong.bind(this)
        this.chapNhanDuyetQuenChamCong = this.chapNhanDuyetQuenChamCong.bind(this)
        this.tuChoiDuyetQuenChamCong = this.tuChoiDuyetQuenChamCong.bind(this)
        this.onClickItem = this.onClickItem.bind(this)
    }

    convertTachDate(date) {
        if (!date) {
            return []
        }
        return date.split("-")
    }

    deleteDuyetQuenChamCong = () => {
        let { dataItem } = this.props
        Alert.alert(
            configs.NAME_APP,
            'Bạn có muốn xóa đơn xin quên chấm công của: ' + dataItem.user_request.name + ' này hay không?',
            [
                {
                    text: configs.DONG_Y, onPress: () => {
                        this.props.deleteDuyetQuenChamCong(dataItem)
                    }
                },
                {
                    text: configs.HUY, onPress: () => {

                    }
                },
            ],
        );
    }

    chapNhanDuyetQuenChamCong = () => {
        let { dataItem } = this.props
        this.props.duyetQuenChamCong(dataItem, true)

    }

    tuChoiDuyetQuenChamCong = () => {
        let { dataItem } = this.props
        this.props.duyetQuenChamCong(dataItem, false)
    }

    onClickItem = () => {
        let { dataItem } = this.props
        // this.props.onClickItem(dataItem)
    }

    render() {
        let { dataItem, isDuyetLichSu = false } = this.props
        let textToDateThu = configs.convertDateToThu(dataItem.date)
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
                        <Text style={[styles.styleTitle, { color: 'black', fontWeight: 'bold', fontSize: 15 }]}>{textToDateThu}</Text>
                        <Text style={[styles.styleTitle, { color: 'gray', fontSize: 9 }]}>{dataItem.type === 1 ? "Quên checkIn" : "Quên checkOut"}</Text>
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

                            {dataItem.state_request == 0 ? <TouchableOpacity onPress={this.deleteDuyetQuenChamCong} style={{ padding: 8 }}>
                                <IconView
                                    name={'recycle-bin'}
                                    color={'red'}
                                    size={16}
                                />
                            </TouchableOpacity> : <View />}
                        </View>

                        <Text style={[styles.styleTitle, { color: configs.colorText, fontSize: 14 }]}>{"Tên: " + dataItem?.user_request?.name}</Text>
                        {dataItem.title ? <Text style={[styles.styleTitle, { color: 'black', fontWeight: 'bold', fontSize: 16 }]}>{dataItem.title}</Text> : <View />}
                        <Text style={[styles.styleTitle, { color: 'gray', fontSize: 9 }]}>{(dataItem.date ? configs.convertTimeDate(dataItem.date, configs.FORMAT_DATE_VN) : '')}</Text>

                        <Text style={[styles.styleTitle, { color: 'black', marginTop: 12 }]}>{dataItem.content ? dataItem.content : ''}</Text>
                    </View>

                </View>

                {!isDuyetLichSu && <View style={{ flexDirection: 'row', marginTop: 15 }}>
                    <TextView
                        onPress={this.chapNhanDuyetQuenChamCong}
                        style={[styles.styleButton, { flex: 3, marginLeft: 0 }]}
                        styleValue={[styles.styleTextButton, {}]}
                        value={"Duyệt"}
                        iconLeft={'verified'}
                        iconColor={'white'}
                        iconSize={14}
                    />
                    <TextView
                        onPress={this.tuChoiDuyetQuenChamCong}
                        style={[styles.styleButton, { flex: 2, backgroundColor: configs.colorDiMuon, borderColor: configs.colorTextOrange, }]}
                        styleValue={[styles.styleTextButton, {}]}
                        value={"Từ chối"}
                        iconLeft={'parcel-refuse'}
                        iconColor={'white'}
                        iconSize={14}
                    />
                </View>}
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
export default connect(mapStateToProps, mapDispatchToProps)(RenderItemDuyetNghiPhep)